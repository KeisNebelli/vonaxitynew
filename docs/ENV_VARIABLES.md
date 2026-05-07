# Environment Variables

---

## Backend (`backend/.env`)

### Required — App Won't Start Without These

| Variable | Example | Description |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/vonaxity` | PostgreSQL connection string. On Railway, this is auto-set from the Postgres service. |
| `JWT_SECRET` | `a-long-random-string-64-chars` | Used to sign and verify JWT tokens. Generate with `openssl rand -hex 32`. Never change in production — existing sessions will be invalidated. |
| `PORT` | `4000` | Port the Express server listens on. Railway sets this automatically; set to `4000` for local dev. |
| `FRONTEND_URL` | `https://vonaxity.com` | The frontend origin — used for CORS and PayPal redirect URLs. For local dev: `http://localhost:3000`. |

---

### PayPal (Payments)

| Variable | Example | Description |
|---|---|---|
| `PAYPAL_CLIENT_ID` | `AaBbCcDd...` | PayPal App Client ID. Found in PayPal Developer Dashboard → Apps & Credentials. |
| `PAYPAL_CLIENT_SECRET` | `EeFfGgHh...` | PayPal App Client Secret. Keep secret — used to get OAuth2 access tokens. |
| `PAYPAL_MODE` | `live` | `sandbox` for local/staging dev, `live` for production. |
| `PAYPAL_PLAN_BASIC` | `P-1AB23456CD789012EF34GHIJ` | PayPal Subscription Plan ID for the Basic plan (€30/month). Create in PayPal Dashboard → Subscriptions → Plans. |
| `PAYPAL_PLAN_STANDARD` | `P-2AB23456...` | PayPal Subscription Plan ID for the Standard plan (€50/month). |
| `PAYPAL_PLAN_PREMIUM` | `P-3AB23456...` | PayPal Subscription Plan ID for the Premium plan (€120/month). |
| `PAYPAL_WEBHOOK_ID` | `5AB12345CD678901EF2G` | Webhook ID from PayPal Dashboard → Webhooks → your endpoint. Used to verify webhook signatures. Optional — if missing, signature check is skipped (not recommended for production). |

> If `PAYPAL_CLIENT_ID` is empty, payment routes return a 500 error with "PayPal not configured". The rest of the app continues to work.

**How to set up PayPal plans:**
1. Log into [developer.paypal.com](https://developer.paypal.com) → Apps & Credentials → Create App
2. Go to PayPal Business dashboard → Products & Subscriptions → Plans → Create Plan
3. Create three plans (Basic €30, Standard €50, Premium €120) with monthly billing cycle
4. Copy each Plan ID (starts with `P-`) into the env vars above
5. Register the webhook URL: `https://your-backend.railway.app/payments/webhook`
6. Subscribe to: `BILLING.SUBSCRIPTION.ACTIVATED`, `PAYMENT.SALE.COMPLETED`, `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.PAYMENT.FAILED`

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
| `NEXT_PUBLIC_BASE_URL` | `https://vonaxity.com` | The frontend's own URL. Used for generating absolute URLs (e.g. in emails). For local dev: `http://localhost:3000`. |

> All `NEXT_PUBLIC_` variables are bundled into the client-side JavaScript. Never put secrets here.

---

## Security Notes

1. **Never commit `.env` or `.env.local`** to Git. Both are in `.gitignore`.
2. **JWT_SECRET**: If rotated in production, all active user sessions are invalidated (everyone gets logged out).
3. **PayPal Client Secret**: Never expose this on the frontend. Only used server-side for getting access tokens.
4. **PayPal sandbox vs live**: Use `PAYPAL_MODE=sandbox` locally. Sandbox transactions are free and don't move real money. Switch to `live` only in production with real PayPal Business account credentials.
5. **ANTHROPIC_API_KEY**: Billed per token. Monitor usage in Anthropic Console. The AI rate limiter (20 req/15 min per IP) limits exposure.

---

## Where to Find Each Key

| Key | Where to Get It |
|---|---|
| `DATABASE_URL` | Railway dashboard → Postgres service → Connect tab |
| `JWT_SECRET` | Generate: `openssl rand -hex 32` |
| `PAYPAL_CLIENT_ID` / `PAYPAL_CLIENT_SECRET` | [developer.paypal.com](https://developer.paypal.com) → Apps & Credentials |
| `PAYPAL_PLAN_*` | PayPal Business Dashboard → Subscriptions → Plans |
| `PAYPAL_WEBHOOK_ID` | PayPal Developer Dashboard → Webhooks → your endpoint |
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

# PayPal — use sandbox for local dev
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox
PAYPAL_PLAN_BASIC=
PAYPAL_PLAN_STANDARD=
PAYPAL_PLAN_PREMIUM=
PAYPAL_WEBHOOK_ID=

# Leave blank for local dev — features degrade gracefully
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
