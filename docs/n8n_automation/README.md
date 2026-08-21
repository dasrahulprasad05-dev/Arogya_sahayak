# 🏥 Arogya Sahayak — n8n Automation Engine Blueprint

Welcome to the **n8n Automation Engine Documentation** for **Arogya Sahayak**. This folder contains the complete architecture, zero-cost setup guides, workflow specifications, and container deployment files to build **10 zero-cost healthcare automation features**.

---

## 📑 Document Index

| Document | Description |
| :--- | :--- |
| 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) | High-level system architecture, Supabase webhook mapping, security standards, and error-handling pipelines. |
| 💰 [ZERO_COST_GUIDE.md](./ZERO_COST_GUIDE.md) | Step-by-step guide to hosting n8n for **$0/month** and obtaining free tier API keys for Telegram, WhatsApp, Email, Google Calendar, and Sheets. |
| ⚙️ [WORKFLOWS_SPECIFICATION.md](./WORKFLOWS_SPECIFICATION.md) | Node-by-node technical specification and JSON payloads for all 10 healthcare workflows. |
| 🐳 [docker-compose.yml](./docker-compose.yml) | 1-Command local or cloud server Docker deployment file for self-hosted n8n. |
| 🔑 [.env.example](./.env.example) | Environment variables template for credentials and secrets. |

---

## 🌟 The 10 Zero-Cost Healthcare Features

1. 📱 **Instant WhatsApp & Telegram Medical Report Delivery**
2. ⏰ **Automated Medicine & Hydration Check-in Bot**
3. 🗓️ **Doctor Appointment Auto-Booking & Google Calendar / Meet Sync**
4. 🚨 **Critical Red-Flag SOS & Family Emergency Dispatch**
5. 📊 **Weekly Patient Health Digest Newsletter**
6. 💊 **30-Day Prescription Refill & Expiry Auto-Alert**
7. 🌦️ **Local Epidemic & Climate Health Alerts (Dengue/Malaria/Heatwaves)**
8. ⭐ **Post-Consultation Doctor Review & Feedback Collector**
9. 🏛️ **Government Scheme (PM-JAY & BSKY) Auto-Eligibility Notifier**
10. 📑 **Live Admin & Doctor Sync to Google Sheets**

---

## 🚀 Quick Start (Running n8n Locally)

To launch n8n locally for testing:
```bash
docker compose -f docs/n8n_automation/docker-compose.yml up -d
```
Open **http://localhost:5678** in your browser to start importing workflows!
