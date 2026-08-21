# Arogya Sahayak — n8n Healthcare Automation Engine
## Architecture, Data Flow & Security Blueprint

---

## 1. High-Level System Architecture

```
                                  AROGYA SAHAYAK PLATFORM
                                 (React PWA / Vite Client)
                                            │
                                            ▼
                               [ Supabase Backend & Database ]
                              (PostgreSQL + Row-Level Security)
                                            │
                   ┌────────────────────────┴────────────────────────┐
                   │ Database Webhooks / Edge Functions              │ Scheduled Cron Jobs
                   ▼                                                 ▼
     ┌────────────────────────────────────────────────────────────────────────┐
     │                      n8n AUTOMATION ENGINE                             │
     │                 (Self-Hosted Community Edition - $0)                   │
     └────────────────────────────────────────────────────────────────────────┘
                   │                        │                        │
       ┌───────────┴───────────┐ ┌──────────┴──────────┐ ┌───────────┴───────────┐
       ▼                       ▼ ▼                     ▼ ▼                       ▼
[ Telegram Bot API ] [ WhatsApp Cloud API ] [ Google Calendar ] [ Resend / SMTP ] [ Google Sheets ]
(Unlimited Alerts)    (1,000 Free Conv/Mo)   (Google Meet Link)  (3,000 Emails/Mo) (Doctor Admin Sync)
```

---

## 2. Component Roles & Communication

| Component | Responsibility | Protocols / Transport |
| :--- | :--- | :--- |
| **Arogya Sahayak PWA** | Patient client (Scans, Triage, Appointments, Reminders) | HTTPS, WebSockets |
| **Supabase DB** | Stores patient scans, appointments, triage results, medication plans | PostgreSQL, pg_net |
| **Supabase Webhooks** | Automatically triggers n8n endpoints on `INSERT` / `UPDATE` | Webhook HTTP POST (HMAC Signed) |
| **n8n Engine** | Orchestrates workflows, formats messages, triggers 3rd party APIs | REST, JSON, Webhooks, Cron |
| **Communication Channels** | Delivers messages, calendar events, PDF reports to patients & doctors | Telegram, WhatsApp, Email, Google API |

---

## 3. Webhook Authentication & Security Standard

To ensure that only authorized Supabase events and frontend calls can trigger n8n workflows:

1. **Shared Secret Token**:
   Every webhook request includes a custom header:
   ```http
   X-Arogya-Webhook-Secret: your_secure_random_token_here
   ```
2. **n8n Verification Node**:
   The first node in every n8n workflow evaluates:
   ```javascript
   $headers['x-arogya-webhook-secret'] === $env.AROGYA_WEBHOOK_SECRET
   ```
   If invalid, n8n immediately terminates the execution and returns `401 Unauthorized`.

3. **Zero PII Exposure**:
   Patient sensitive IDs (Aadhaar, raw passwords) are never transmitted in webhook payloads. Only sanitized triage metadata, user phone numbers/emails, and reference IDs are passed.

---

## 4. Database Trigger Mappings

```
  Event in Supabase                         n8n Webhook Endpoint                         Triggered Workflow
  ─────────────────                         ────────────────────                         ──────────────────
  `INSERT on scan_history`        ───►     `/webhook/scan-completed`            ───►     #1 Instant WhatsApp/Telegram Report
  `INSERT on appointments`        ───►     `/webhook/appointment-booked`        ───►     #3 Doctor Calendar & Google Meet
  `UPDATE on triage_risk (High)`  ───►     `/webhook/emergency-alert`           ───►     #4 Red-Flag SOS & PHC Escalation
  `INSERT on doctor_reviews`      ───►     `/webhook/review-submitted`          ───►     #8 Review Verification
  `INSERT on prescriptions`       ───►     `/webhook/prescription-logged`       ───►     #6 30-Day Refill Tracker
```

---

## 5. Error Handling & Reliability Strategy

1. **Automatic Retries**:
   All outbound notification nodes (Telegram, WhatsApp, Email) are configured with:
   - **Retry on Fail**: Enabled
   - **Max Tries**: 3
   - **Wait Between Tries**: 5000ms

2. **Dead Letter Queue / Error Workflow**:
   If any workflow fails (e.g. invalid phone number or network timeout), n8n routes the error to a dedicated **Global Error Handler** workflow that logs the error in Supabase `system_logs` and alerts the system admin via Telegram.
