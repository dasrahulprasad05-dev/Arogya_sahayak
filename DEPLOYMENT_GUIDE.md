# 🚀 Production Deployment & Hosting Guide — Arogya Sahayak

This document outlines the complete procedure to deploy **Arogya Sahayak** across production cloud platforms.

---

## 🏗️ System Architecture Overview

```
                        ┌────────────────────────────────────────┐
                        │      Vercel / Cloudflare Pages         │
                        │      React 18 + Vite PWA Client        │
                        └───────────────────┬────────────────────┘
                                            │
                    ┌───────────────────────┴────────────────────────┐
                    │                                                │
                    ▼                                                ▼
     ┌─────────────────────────────┐                  ┌─────────────────────────────┐
     │        Supabase Cloud       │                  │       Render / Railway      │
     │ - PostgreSQL + Auth         │                  │ - FastAPI Python Backend    │
     │ - Row Level Security (RLS)  │                  │ - LangGraph Clinical RAG    │
     │ - 5 Hardened Edge Functions │                  │ - Explainable ML Predictors │
     │ - QR Code Ticket Storage    │                  │ - Prescription OCR Vision   │
     └─────────────────────────────┘                  └─────────────────────────────┘
```

---

## 1. 🌐 Frontend Deployment (Vercel)

### Steps:
1. Connect your GitHub repository (`https://github.com/dasrahulprasad05-dev/Arogya_sahayak`) to [Vercel](https://vercel.com).
2. Set the **Framework Preset** to `Vite`.
3. Build Settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Set Environment Variables:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
5. Deploy! Vercel will use [`vercel.json`](file:///d:/anigravity_project_rahul/arogyasahayak/vercel.json) for client-side SPA routing and security headers.

---

## 2. 🐍 Backend ML & LangGraph Deployment (Render / Railway)

### Option A: Render.com (Web Service via Docker)
1. In Render Dashboard, click **New > Web Service**.
2. Select repository and choose **Docker** runtime.
3. Configure environment variables:
   ```env
   GROQ_API_KEY=gsk_...
   ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:5173
   ```
4. Health check path: `/health`
5. Render will automatically build the container using [`Dockerfile`](file:///d:/anigravity_project_rahul/arogyasahayak/Dockerfile).

---

## 3. 🛡️ Supabase Database & Edge Functions Deployment

### Deploying Edge Functions:
```bash
# Login to Supabase CLI
npx supabase login

# Link your remote cloud project
npx supabase link --project-ref <your-project-id>

# Deploy all 5 hardened Edge Functions
npx supabase functions deploy health-ai-insights
npx supabase functions deploy symptom-checker
npx supabase functions deploy generate-report
npx supabase functions deploy doctor-system
npx supabase functions deploy manage-doctors
```

### Set Cloud Secrets:
```bash
npx supabase secrets set GROQ_API_KEY=gsk_...
```

---

## 4. 🧪 Local Testing via Docker Compose

To run the complete ML backend and RAG engine locally via Docker:
```bash
docker-compose up --build
```
The FastAPI backend will be available at `http://localhost:8000`.
