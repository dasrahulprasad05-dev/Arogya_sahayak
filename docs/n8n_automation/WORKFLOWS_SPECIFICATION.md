# Arogya Sahayak — 10 Healthcare n8n Workflows Specification
## Complete Node-by-Node Technical Specification

---

## Workflow #1: Instant WhatsApp & Telegram Medical Report Delivery
* **Trigger**: Webhook `POST /webhook/scan-completed` (Fired by Supabase `scan_history` insert or frontend after scan).
* **Goal**: Deliver formatted medical findings, Grad-CAM heatmap download link, and personalized precautions to the patient's phone.

```
[Webhook Node] ──► [Auth Check] ──► [Format Multilingual Text] ──► [Branch: User Preference]
                                                                        ├──► [Telegram Node] (Send Report & Heatmap)
                                                                        └──► [WhatsApp Node] (Send Template Message)
```

### Payload Structure:
```json
{
  "patient_name": "Rahul Prasad",
  "phone": "+919876543210",
  "telegram_chat_id": "123456789",
  "preferred_language": "or",
  "scan_tool": "chest",
  "condition_name": "Pulmonary Infiltration Assessment",
  "risk_level": "Moderate",
  "confidence": 84,
  "precautions": [
    "Practice steam inhalation twice daily",
    "Monitor SpO2 twice daily",
    "Avoid smoke and dusty air"
  ],
  "report_url": "https://arogyasahayak.in/reports/scan_8921.pdf"
}
```

---

## Workflow #2: Automated Medicine & Hydration Check-in Bot
* **Trigger**: n8n Cron Node running at 08:00, 14:00, 20:00 daily.
* **Goal**: Interactive WhatsApp/Telegram check-in asking if medicines were taken and updating Supabase adherence records.

```
[Cron Trigger (3x/day)] ──► [Supabase Node: Query Active Reminders] ──► [Split In Batches]
                                                                            │
                                                                            ▼
                                                [Send Telegram/WhatsApp Interactive Quick-Reply]
                                                                            │
                                                                            ▼
                                                [Listen on Callback Webhook: 'Taken' / 'Snooze']
                                                                            │
                                                                            ▼
                                                [Supabase Node: Update Adherence Streak]
```

---

## Workflow #3: Doctor Appointment Auto-Booking & Google Calendar / Meet Sync
* **Trigger**: Webhook `POST /webhook/appointment-booked`.
* **Goal**: Synchronize doctor's calendar, create a Google Meet video conference link, and notify both parties.

```
[Webhook Node] ──► [Google Calendar Node: Create Event + Meet Link]
                         │
                         ▼
        ┌────────────────┴────────────────┐
        ▼                                 ▼
[Resend Email to Doctor]        [WhatsApp / Email to Patient]
(With Patient Clinical Summary)  (With Meeting Link & Instructions)
```

---

## Workflow #4: Critical Red-Flag SOS & Family Emergency Dispatch
* **Trigger**: Webhook `POST /webhook/emergency-alert` (Fired when risk === 'Critical' or 108 SOS button tapped).
* **Goal**: Instant SMS/Telegram alert to designated emergency contacts and nearest PHC duty desk.

```
[Webhook: SOS Trigger] ──► [Fetch Patient Emergency Contacts from DB]
                                │
                                ▼
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
[Urgent Telegram Alert]   [SMS / Twilio Alert]    [Log in 108 Emergency Queue]
(Includes Live GPS Map)  (Includes Patient Info)  (Flags District Ambulance Desk)
```

---

## Workflow #5: Weekly Patient Health Digest Newsletter
* **Trigger**: n8n Cron Node running every Sunday at 09:00 AM.
* **Goal**: Generate and email a comprehensive 7-day health trend report.

```
[Cron: Every Sunday] ──► [Supabase Node: Aggregate Weekly Stats (ECG, Water, Mood, Scans)]
                              │
                              ▼
                      [HTML Template Renderer]
                              │
                              ▼
                      [Resend Node: Send Email Digest]
```

---

## Workflow #6: 30-Day Prescription Refill & Expiry Auto-Alert
* **Trigger**: n8n Cron Node running daily at 10:00 AM.
* **Goal**: Check scanned prescriptions with `expiry_date = TODAY + 3 days` and prompt patient to refill.

```
[Cron: Daily 10 AM] ──► [Supabase Node: Query Expiring Prescriptions]
                             │
                             ▼
                     [Send Refill Alert on WhatsApp]
                     ("Your BP tablets finish in 3 days. [1-Click Reorder / Book Followup]")
```

---

## Workflow #7: Local Epidemic & Climate Health Alerts
* **Trigger**: n8n Cron Node running daily at 06:00 AM.
* **Goal**: Fetch OpenWeatherMap rainfall & humidity; push Dengue/Malaria precautions if outbreak criteria met.

```
[Cron: Daily 6 AM] ──► [HTTP Request: OpenWeather API for Odisha / Target States]
                            │
                            ▼
                    [IF Node: Humidity > 80% & Rain > 20mm]
                            │
                            ├──► TRUE: [Supabase Node: Query Users in Pincodes]
                            │              │
                            │              ▼
                            │          [Broadcast Malaria/Dengue Prevention Tips via Telegram/WhatsApp]
                            │
                            └──► FALSE: [End Workflow]
```

---

## Workflow #8: Post-Consultation Doctor Review & Feedback Collector
* **Trigger**: Scheduled execution 2 hours after `appointment.end_time`.
* **Goal**: Collect patient rating and written review without requiring manual app login.

```
[Schedule: 2h Post-Visit] ──► [Send Telegram/WhatsApp Star Rating Request]
                                    │
                                    ▼
                            [Webhook: Receive Star Rating (1-5)]
                                    │
                                    ▼
                            [Supabase Node: Insert into `doctor_reviews`]
```

---

## Workflow #9: Government Scheme (PM-JAY & BSKY) Auto-Eligibility Notifier
* **Trigger**: Webhook `POST /webhook/scheme-check` (Fired on registration or high-cost diagnostic triage).
* **Goal**: Cross-reference state/income rules and guide patient to free empanelled hospital treatment.

```
[Webhook Node] ──► [Rule Engine Node: Evaluate State & BPL Criteria]
                        │
                        ▼
                [Send Scheme Eligibility Guide PDF via WhatsApp]
                ("You are eligible for up to ₹5 Lakh free care under BSKY / PM-JAY")
```

---

## Workflow #10: Live Admin & Doctor Sync to Google Sheets
* **Trigger**: Webhook `POST /webhook/sync-sheet` (Fired on new appointments or scans).
* **Goal**: Append row into Google Sheet for rural clinic administrators.

```
[Webhook Node] ──► [Google Sheets Node: Append Row]
                   (Columns: Date, Patient ID, Age, Gender, Triage Result, Doctor Assigned, Status)
```
