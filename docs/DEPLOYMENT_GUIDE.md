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

STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_STANDARD=price_...
STRIPE_PRICE_PREMIUM=price_...

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
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
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

## Stripe Webhook Setup

Stripe must be able to reach the backend to confirm payments.

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → Webhooks
2. Add endpoint: `https://vonaxitynew-production.up.railway.app/payments/webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the **Webhook Signing Secret** → set as `STRIPE_WEBHOOK_SECRET` in Railway

**Important**: The webhook endpoint receives raw (unparsed) request bodies. This is handled in `server.js` before `express.json()` middleware. Do not move the webhook route or add JSON parsing before it.

---

## Stripe Products Setup

Create 3 products in Stripe Dashboard → Products:

| Product | Price | Billing | Price ID env var |
|---|---|---|---|
| Basic | €30.00 | Monthly | `STRIPE_PRICE_BASIC` |
| Standard | €50.00 | Monthly | `STRIPE_PRICE_STANDARD` |
| Premium | €120.00 | Monthly | `STRIPE_PRICE_PREMIUM` |

Copy each Price ID (starts with `price_`) into Railway environment variables.

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
3. Use separate Stripe test keys (`sk_test_`, `pk_test_`) for staging
4. Set `FRONTEND_URL` and `NEXT_PUBLIC_API_URL` to the staging URLs

---

## Health Monitoring

- **Backend health**: `GET /health` returns `200 OK` with status and timestamp
- **Uptime monitoring**: Consider adding UptimeRobot or Better Uptime pointing to the `/health` endpoint
- **Error logging**: Currently `console.error` — consider adding Sentry (`@sentry/node`) for production error tracking
