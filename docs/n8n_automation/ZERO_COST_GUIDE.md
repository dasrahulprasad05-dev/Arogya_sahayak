# Arogya Sahayak — Zero-Cost Hosting & API Guide
## How to Run 100% of n8n & External Services for $0 / Month

---

## 1. Zero-Cost Infrastructure Summary

| Layer | Service Provider | Plan / Tier | Cost | Limits / Capacity |
| :--- | :--- | :--- | :--- | :--- |
| **Workflow Engine** | **n8n Self-Hosted** | Community Edition (Open Source) | **$0.00** | **Unlimited** executions & workflows |
| **Cloud Hosting** | **Render / Railway / Oracle Free Tier** | Free Web Service / 24GB RAM Always-Free | **$0.00** | 750 free compute hours/mo |
| **Database** | **Supabase** | Free Tier | **$0.00** | 500MB DB, 50k MAU, Webhooks included |
| **Instant Messaging**| **Telegram Bot API** | BotFather Official | **$0.00** | **Unlimited** messages, files, & buttons |
| **WhatsApp Alerts** | **Meta WhatsApp Cloud API** | Developer Free Tier | **$0.00** | **1,000 Free conversations / month** |
| **Transactional Email**| **Resend** | Free Tier | **$0.00** | **3,000 Emails / month** (100 / day) |
| **Calendar & Video** | **Google Cloud Platform** | Free Tier (OAuth 2.0) | **$0.00** | Google Calendar + Google Meet links |
| **Admin Sheets** | **Google Sheets API** | Free Tier (Service Account) | **$0.00** | Read / Write spreadsheets |
| **Weather & Climate**| **OpenWeatherMap API** | Free OneCall Tier | **$0.00** | **1,000 Free calls / day** |

---

## 2. Setting Up Self-Hosted n8n for $0

### Option A: 1-Click Deploy on Render (Recommended Cloud Option)
1. Create a free account at [render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Select **Docker Image** and enter:
   ```
   n8nio/n8n:latest
   ```
4. Set Environment Variables:
   ```env
   N8N_PORT=5678
   N8N_PROTOCOL=https
   NODE_ENV=production
   WEBHOOK_URL=https://your-app-name.onrender.com/
   N8N_BASIC_AUTH_ACTIVE=true
   N8N_BASIC_AUTH_USER=admin
   N8N_BASIC_AUTH_PASSWORD=your_secure_password
   ```
5. Deploy! Your free cloud n8n server is live with SSL at `https://your-app-name.onrender.com`.

---

### Option B: Local Docker Container (Development & Testing)
Run with a single terminal command:
```bash
docker run -d --name arogya-n8n -p 5678:5678 -v ~/.n8n:/home/node/.n8n n8nio/n8n
```
Access in your browser at `http://localhost:5678`.

---

## 3. Configuring Free APIs & Credentials

### 1. Telegram Bot (Unlimited Free Messages)
1. Open Telegram and search for `@BotFather`.
2. Send `/newbot`, give it a name: `ArogyaSahayakBot`.
3. Copy the **HTTP API Bot Token** (e.g., `7123456789:AAH...`).
4. In n8n: Create a **Telegram** credential and paste your Token.

### 2. WhatsApp Cloud API (1,000 Free Conversations / Month)
1. Go to [developers.facebook.com](https://developers.facebook.com) and create a free App under **Business**.
2. Add **WhatsApp** product.
3. Obtain your free **Test Phone Number ID** and **Access Token**.
4. In n8n: Use the built-in **WhatsApp** node or **HTTP Request** node.

### 3. Resend (3,000 Free Monthly Emails)
1. Sign up at [resend.com](https://resend.com).
2. Create an API Key (`re_...`).
3. In n8n: Use the **HTTP Request** node with `Authorization: Bearer re_...` to send branded HTML emails.

### 4. Google Calendar & Google Sheets (Free via Google Cloud Console)
1. Go to [console.cloud.google.com](https://console.cloud.google.com).
2. Create a free project named `Arogya-Sahayak`.
3. Enable **Google Calendar API** and **Google Sheets API**.
4. Create an **OAuth 2.0 Client ID** or **Service Account**.
5. In n8n: Connect your Google account with 1 click.

---

## 4. Connecting Supabase Webhooks to n8n

1. Open your Supabase Dashboard → **Database** → **Webhooks**.
2. Click **Create a new webhook**.
3. Set Table: `scan_history` (or `appointments`).
4. Events: Check `INSERT`.
5. HTTP Request:
   - **Method**: `POST`
   - **URL**: `https://your-n8n-domain.com/webhook/scan-completed`
   - **HTTP Headers**: `X-Arogya-Webhook-Secret: your_secret_token`
6. Click **Save Webhook**. Done!
