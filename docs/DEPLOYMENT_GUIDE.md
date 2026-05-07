# Deployment Guide

Vonaxity uses two hosting platforms:
- **Frontend** → [Vercel](https://vercel.com) (Next.js)
- **Backend** → [Railway](https://railway.app) (Express + PostgreSQL)

Both auto-deploy when code is pushed to the `main` branch of the GitHub repo.

---

## Architecture

```
GitHub (main branch)
    ├── push → Vercel (frontend/)     → vonaxity.com
    └── push → Railway (backend/)     → vonaxitynew-production.up.railway.app
                    └── PostgreSQL DB (Railway internal)
```

---

## Backend Deployment (Railway)

### Initial Setup (first time)

1. Go to [railway.app](https://railway.app) → New Project
2. Select **Deploy from GitHub Repo**
3. Connect to `KeisNebelli/vonaxitynew`
4. Set the **Root Directory** to `backend`
5. Add a **PostgreSQL** service (Railway provides managed Postgres)
6. Railway will automatically set `DATABASE_URL` from the Postgres service

### Environment Variables (set in Railway dashboard)

```env
DATABASE_URL=<automatically set by Railway Postgres service>
JWT_SECRET=<generate a strong random string, 64+ chars>
PORT=4000
FRONTEND_URL=https://vonaxity.com

PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=live
PAYPAL_PLAN_BASIC=P-your_basic_plan_id
PAYPAL_PLAN_STANDARD=P-your_standard_plan_id
PAYPAL_PLAN_PREMIUM=P-your_premium_plan_id
PAYPAL_WEBHOOK_ID=your_webhook_id_here

TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...

RESEND_API_KEY=re_...
EMAIL_FROM=noreply@vonaxity.com

ANTHROPIC_API_KEY=sk-ant-...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Start Command

Railway uses this from `package.json`:
```json
"start": "prisma migrate deploy && node server.js"
```

`prisma migrate deploy` runs automatically on every deploy — it applies any pending migrations without resetting data.

### Database Migrations

```bash
# From your local machine — run against the production DB
cd backend
DATABASE_URL="<railway-postgres-url>" npx prisma migrate deploy
```

Never run `prisma migrate dev` against production — it can reset data.

### Verify Backend is Running

```
GET https://vonaxitynew-production.up.railway.app/health
→ {"status":"ok","service":"Vonaxity API","timestamp":"..."}
```

---

## Frontend Deployment (Vercel)

### Initial Setup (first time)

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import from GitHub: `KeisNebelli/vonaxitynew`
3. Set **Root Directory** to `frontend`
4. Framework: **Next.js** (auto-detected)
5. Add environment variables (below)
6. Click Deploy

### Environment Variables (set in Vercel dashboard)

```env
NEXT_PUBLIC_API_URL=https://vonaxitynew-production.up.railway.app
# (no frontend PayPal key needed — server-side only)
NEXT_PUBLIC_BASE_URL=https://vonaxity.com
```

> `NEXT_PUBLIC_` prefix is required by Next.js to expose variables to the browser.

### Custom Domain

In Vercel project settings → Domains:
- Add `vonaxity.com` and `www.vonaxity.com`
- Vercel provides DNS instructions (usually CNAME or A record)
- SSL certificate is automatic (Let's Encrypt via Vercel)

### Build & Deploy

Vercel auto-deploys on every push to `main`. Manual deploy:

```bash
# Install Vercel CLI
npm i -g vercel

# From frontend/
vercel --prod
```

---

## PayPal Webhook Setup

PayPal must be able to reach the backend to confirm subscription events.

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com) → My Apps & Credentials → your app → Webhooks
2. Add endpoint: `https://vonaxitynew-production.up.railway.app/payments/webhook`
3. Subscribe to events:
   - `BILLING.SUBSCRIPTION.ACTIVATED`
   - `PAYMENT.SALE.COMPLETED`
   - `BILLING.SUBSCRIPTION.CANCELLED`
   - `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
4. Copy the **Webhook ID** → set as `PAYPAL_WEBHOOK_ID` in Railway

**Important**: The PayPal webhook uses standard JSON body — no raw body handling needed. This is different from the old Stripe integration.

---

## PayPal Subscription Plans Setup

Create 3 subscription plans in PayPal Business Dashboard → Subscriptions → Plans:

| Plan | Price | Billing | Env var |
|---|---|---|---|
| Basic | €30.00 | Monthly | `PAYPAL_PLAN_BASIC` |
| Standard | €50.00 | Monthly | `PAYPAL_PLAN_STANDARD` |
| Premium | €120.00 | Monthly | `PAYPAL_PLAN_PREMIUM` |

Copy each Plan ID (starts with `P-`) into Railway environment variables.

**Steps to create a plan:**
1. PayPal Business Dashboard → Products & Services → Subscriptions → Plans → Create Plan
2. First create a "Product" (Vonaxity Nursing Service), then create plans under it
3. Set currency to EUR, billing cycle to Monthly, no setup fee

---

## Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → Copy Cloud Name, API Key, API Secret
3. Set in Railway: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Used for: nurse license/diploma uploads, nurse profile photos.

---

## Deploying a New Feature

```bash
# Make changes locally
git add .
git commit -m "Your message"
git push origin main
```

Both Railway and Vercel will auto-deploy within ~2 minutes.

Monitor deployments:
- Railway: railway.app → your project → Deployments
- Vercel: vercel.com → your project → Deployments

---

## Rollback

### Vercel
- Vercel dashboard → Deployments → click any previous deployment → "Promote to Production"

### Railway
- Railway dashboard → Deployments → click any previous deployment → "Rollback"

---

## Environment Separation

Currently there is one environment (production). To add staging:

1. Create a second Railway project (same repo, `staging` branch)
2. Create a second Vercel project pointing to `staging` branch
3. Use PayPal sandbox credentials (`PAYPAL_MODE=sandbox`) for staging — free and safe to test with
4. Set `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` to the staging URLs

---

## Health Monitoring

- **Backend health**: `GET /health` returns `200 OK` with status and timestamp
- **Uptime monitoring**: Consider adding UptimeRobot or Better Uptime pointing to the `/health` endpoint
- **Error logging**: Currently `console.error` — consider adding Sentry (`@sentry/node`) for production error tracking
