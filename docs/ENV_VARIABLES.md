# Environment Variables

---

## Backend (`backend/.env`)

### Required — App Won't Start Without These

| Variable | Example | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/vonaxity` | PostgreSQL connection string. On Railway, this is auto-set from the Postgres service. |
| `JWT_SECRET` | `a-long-random-string-64-chars` | Used to sign and verify JWT tokens. Generate with `openssl rand -hex 32`. Never change in production — existing sessions will be invalidated. |
| `PORT` | `4000` | Port the Express server listens on. Railway sets this automatically; set to `4000` for local dev. |
| `FRONTEND_URL` | `https://vonaxity.com` | The frontend origin — used for CORS and Stripe redirect URLs. For local dev: `http://localhost:3000`. |

---

### Stripe (Payments)

| Variable | Example | Description |
|---|---|---|
| `STRIPE_SECRET_KEY` | `sk_live_...` | Stripe secret key. Find in Stripe Dashboard → Developers → API Keys. Use `sk_test_...` for local dev. |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Webhook signing secret. Created when you add the webhook endpoint in Stripe Dashboard → Developers → Webhooks. Used to verify that webhook events actually come from Stripe. |
| `STRIPE_PRICE_BASIC` | `price_1ABC...` | Stripe Price ID for the Basic plan (€30/month). Create in Stripe Dashboard → Products. |
| `STRIPE_PRICE_STANDARD` | `price_1DEF...` | Stripe Price ID for the Standard plan (€50/month). |
| `STRIPE_PRICE_PREMIUM` | `price_1GHI...` | Stripe Price ID for the Premium plan (€120/month). |

> If `STRIPE_SECRET_KEY` is empty, payment routes return a 500 error with "Stripe not configured". The rest of the app continues to work.

---

### Twilio (SMS)

| Variable | Example | Description |
|---|---|---|
| `TWILIO_ACCOUNT_SID` | `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` | Twilio Account SID. Found in Twilio Console → Dashboard. |
| `TWILIO_AUTH_TOKEN` | `your_auth_token` | Twilio Auth Token. Found in Twilio Console → Dashboard. Keep secret. |
| `TWILIO_PHONE_NUMBER` | `+12025551234` | Twilio phone number to send SMS from. Must be in E.164 format. |

> SMS is currently used for visit reminders. If Twilio credentials are missing, SMS calls will fail silently (logged to console).

---

### Resend (Email)

| Variable | Example | Description |
|---|---|---|
| `RESEND_API_KEY` | `re_xxxxxxxxxxxxxxxxxxxxxx` | Resend API key. Found in Resend Dashboard → API Keys. |
| `EMAIL_FROM` | `noreply@vonaxity.com` | Sender address for all outgoing emails. Must be a verified domain in Resend. |

> Used for: password reset emails, visit report emails. If missing, email calls fail silently.

---

### Anthropic (AI Assistant)

| Variable | Example | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | Anthropic API key. Found in Anthropic Console → API Keys. Used for the Vona AI assistant (Claude Haiku). |

> If missing, AI chat returns "AI assistant is temporarily unavailable."

---

### Cloudinary (File Uploads)

| Variable | Example | Description |
|---|---|---|
| `CLOUDINARY_CLOUD_NAME` | `dxxxxxx` | Cloudinary cloud name. Found in Cloudinary Dashboard. |
| `CLOUDINARY_API_KEY` | `123456789012345` | Cloudinary API key. |
| `CLOUDINARY_API_SECRET` | `xxxxxxxxxxxxxxxxxxxx` | Cloudinary API secret. Keep secret. |

> Used for nurse license/diploma/photo uploads. If missing, file uploads will fail with an error.

---

## Frontend (`frontend/.env.local`)

| Variable | Example | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `https://vonaxitynew-production.up.railway.app` | The backend API URL. The `NEXT_PUBLIC_` prefix exposes this to the browser. For local dev: `http://localhost:4000`. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` | Stripe publishable key (safe to expose). Used for Stripe Elements if needed. For local dev: `pk_test_...`. |
| `NEXT_PUBLIC_BASE_URL` | `https://vonaxity.com` | The frontend's own URL. Used for generating absolute URLs (e.g. in emails). For local dev: `http://localhost:3000`. |

> All `NEXT_PUBLIC_` variables are bundled into the client-side JavaScript. Never put secrets here.

---

## Security Notes

1. **Never commit `.env` or `.env.local`** to Git. Both are in `.gitignore`.
2. **JWT_SECRET**: If rotated in production, all active user sessions are invalidated (everyone gets logged out).
3. **Stripe keys**: Use test keys (`sk_test_`, `pk_test_`) locally and in staging. Never use live keys locally.
4. **Stripe webhook secret**: Unique per webhook endpoint — if you add a second webhook endpoint (e.g. staging), it gets a different secret.
5. **ANTHROPIC_API_KEY**: Billed per token. Monitor usage in Anthropic Console. The AI rate limiter (20 req/15 min per IP) limits exposure.

---

## Where to Find Each Key

| Key | Where to Get It |
|---|---|
| `DATABASE_URL` | Railway dashboard → Postgres service → Connect tab |
| `JWT_SECRET` | Generate: `openssl rand -hex 32` |
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com](https://dashboard.stripe.com) → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Developers → Webhooks → your endpoint |
| `STRIPE_PRICE_*` | Stripe Dashboard → Products → each product → Price ID |
| `TWILIO_*` | [console.twilio.com](https://console.twilio.com) |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys |
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) → API Keys |
| `CLOUDINARY_*` | [cloudinary.com](https://cloudinary.com) → Dashboard |

---

## Example `.env` for Local Development (backend)

```env
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/vonaxity
JWT_SECRET=development-secret-change-this-in-production-please
PORT=4000
FRONTEND_URL=http://localhost:3000

# Leave blank for local dev — features degrade gracefully
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_BASIC=
STRIPE_PRICE_STANDARD=
STRIPE_PRICE_PREMIUM=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
RESEND_API_KEY=
EMAIL_FROM=
ANTHROPIC_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
