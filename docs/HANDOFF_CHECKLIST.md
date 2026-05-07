# Handoff Checklist

This document lists every account, credential, service, and piece of infrastructure a new owner or developer needs to take control of Vonaxity.

---

## GitHub Repository

| Item | Detail |
|---|---|
| Repo URL | https://github.com/KeisNebelli/vonaxitynew |
| Primary branch | `main` |
| Access | Transfer repo ownership in GitHub → Settings → Danger Zone → Transfer |

**Action for new owner**: Transfer repository to new GitHub account/org, or add new owner as admin collaborator.

---

## Domain

| Item | Detail |
|---|---|
| Domain | vonaxity.com |
| Registrar | (check with founder — likely Namecheap, GoDaddy, or Cloudflare Registrar) |
| DNS | Managed by Vercel (Vercel handles SSL and routing) |
| Email domain | vonaxity.com (used for `hello@vonaxity.com` and `noreply@vonaxity.com`) |

**Action for new owner**:
1. Get domain registrar login credentials from founder
2. Transfer domain registrar account or update nameservers to new owner's Vercel account
3. In Vercel: Settings → Domains → verify vonaxity.com is connected

---

## Frontend Hosting — Vercel

| Item | Detail |
|---|---|
| Platform | vercel.com |
| Project | vonaxity-frontend (or similar) |
| Auto-deploy | Yes — triggers on push to `main` |
| Custom domain | vonaxity.com + www.vonaxity.com |

**Action for new owner**:
1. Create new Vercel account (or use existing)
2. Import GitHub repo — set root directory to `frontend`
3. Set all `NEXT_PUBLIC_*` environment variables (see `docs/ENV_VARIABLES.md`)
4. Point domain DNS to new Vercel project
5. Or: add new owner as team member on existing Vercel project

**Env vars needed in Vercel**:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_BASE_URL`

---

## Backend Hosting — Railway

| Item | Detail |
|---|---|
| Platform | railway.app |
| Service | vonaxity-backend (Express API) |
| Database | Railway PostgreSQL (same project) |
| Auto-deploy | Yes — triggers on push to `main` |

**Action for new owner**:
1. Create new Railway account (or use existing)
2. Transfer Railway project or create new project from GitHub repo
3. Set root directory to `backend`
4. Add all environment variables (see `docs/ENV_VARIABLES.md`)
5. Provision new PostgreSQL service if not transferred

**Env vars needed in Railway**:
- `DATABASE_URL` (auto-set by Railway Postgres)
- `JWT_SECRET`
- `PORT` (Railway sets this automatically)
- `FRONTEND_URL`
- All PayPal, Twilio, Resend, Anthropic, Cloudinary keys

---

## Database

| Item | Detail |
|---|---|
| Provider | Railway PostgreSQL |
| ORM | Prisma |
| Schema file | `backend/prisma/schema.prisma` |
| Migration history | `backend/prisma/migrations/` |

**Action for new owner**:
1. Railway project → Postgres service → Connect → copy `DATABASE_URL`
2. To take a manual backup: `pg_dump <DATABASE_URL> > vonaxity_backup.sql`
3. To restore: `psql <NEW_DATABASE_URL> < vonaxity_backup.sql`
4. After setting up new Railway project, run: `npx prisma migrate deploy` (handled automatically by start script)

**Important**: Never run `prisma migrate reset` on production — it wipes all data.

---

## PayPal (Payments)

| Item | Detail |
|---|---|
| Platform | paypal.com (Business) / developer.paypal.com |
| Mode | Live |
| Products | Basic (€30/mo), Standard (€50/mo), Premium (€120/mo) |
| Webhook endpoint | `https://vonaxitynew-production.up.railway.app/payments/webhook` |

**Action for new owner**:
1. Get PayPal Business account login from founder, or create new account
2. Go to [developer.paypal.com](https://developer.paypal.com) → Apps & Credentials → copy Client ID and Client Secret
3. Go to PayPal Business dashboard → Subscriptions → Plans → copy Plan IDs (P-xxx) for each tier
4. Register webhook: Developer Dashboard → Webhooks → Add Webhook → enter backend URL above
5. Subscribe to events: `BILLING.SUBSCRIPTION.ACTIVATED`, `PAYMENT.SALE.COMPLETED`, `BILLING.SUBSCRIPTION.CANCELLED`, `BILLING.SUBSCRIPTION.PAYMENT.FAILED`
6. Copy Webhook ID → update `PAYPAL_WEBHOOK_ID` in Railway
7. Update all `PAYPAL_*` env vars in Railway (see `docs/ENV_VARIABLES.md`)

**Note**: PayPal Business accounts in Albania are supported and can receive international payments.

---

## Cloudinary (File Storage)

| Item | Detail |
|---|---|
| Platform | cloudinary.com |
| Usage | Nurse license/diploma uploads, profile photos |
| Free tier | 25GB storage, 25GB bandwidth/month |

**Action for new owner**:
1. Get Cloudinary account login from founder or create new account
2. Dashboard → copy Cloud Name, API Key, API Secret
3. Update `CLOUDINARY_*` env vars in Railway

---

## Resend (Email)

| Item | Detail |
|---|---|
| Platform | resend.com |
| From address | noreply@vonaxity.com |
| Usage | Password reset emails, visit health reports |

**Action for new owner**:
1. Get Resend account login from founder or create new account
2. Resend Dashboard → API Keys → create new key
3. Domains → verify vonaxity.com (add DNS TXT/MX records in domain registrar)
4. Update `RESEND_API_KEY` and `EMAIL_FROM` in Railway

---

## Twilio (SMS)

| Item | Detail |
|---|---|
| Platform | twilio.com |
| Usage | Visit reminder SMS to clients and nurses |
| Phone number | Albanian-capable Twilio number |

**Action for new owner**:
1. Get Twilio account login from founder or create new account
2. Twilio Console → Account SID and Auth Token (Dashboard)
3. Phone Numbers → copy the active number
4. Update `TWILIO_*` env vars in Railway

---

## Anthropic (AI / Vona)

| Item | Detail |
|---|---|
| Platform | console.anthropic.com |
| Model | Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) |
| Usage | Vona AI assistant in all 4 contexts (landing, client, nurse, admin) |
| Rate limit | 20 AI requests / 15 min per IP (backend-enforced) |

**Action for new owner**:
1. Create new Anthropic account or get access to existing account
2. Console → API Keys → create new key
3. Update `ANTHROPIC_API_KEY` in Railway
4. Monitor usage in Anthropic Console — billed per token (Haiku is the most affordable model)

---

## Business Email

| Item | Detail |
|---|---|
| Address | hello@vonaxity.com |
| Provider | (confirm with founder — likely Google Workspace or Zoho) |

**Action for new owner**: Get email account credentials or set up forwarding to new owner's email.

---

## How to Add a New Developer Safely

1. **GitHub**: Add as collaborator with "Write" access (not Owner) → Settings → Collaborators
2. **Vercel**: Add to Vercel team as "Developer" (cannot delete project, cannot change domain)
3. **Railway**: Add to Railway project as "Developer" (can view logs and env vars)
4. **Database**: Developer should access the database via Prisma Studio locally (not directly on production)
5. **PayPal**: Add as a user in PayPal Business Account Settings → Manage Users — limited to view only, cannot withdraw funds
6. **API Keys**: Give new developers their own API keys where possible (Anthropic, Cloudinary). Do NOT share the production JWT_SECRET or PayPal Client Secret unless necessary.

**Never share**:
- Production `JWT_SECRET` (rotating it logs out all users)
- PayPal Client Secret (grants access to all payment operations)
- Database root password
- Twilio Auth Token (can send SMS globally)

---

## Go-Live Checklist for New Owner

- [ ] GitHub repo transferred or forked
- [ ] Vercel project connected to new GitHub account
- [ ] Railway project running with all env vars set
- [ ] Database backup taken before any migration
- [ ] PayPal Business account verified and live credentials set in Railway
- [ ] PayPal Subscription Plans created (Basic, Standard, Premium) with correct pricing
- [ ] PayPal webhook URL registered and all 4 events subscribed
- [ ] Domain DNS pointing to new Vercel project
- [ ] SSL certificate active on vonaxity.com (automatic via Vercel)
- [ ] `GET /health` returns 200 OK
- [ ] Test login works (client, nurse, admin)
- [ ] Test booking flow works end-to-end
- [ ] Test PayPal checkout with a sandbox account (use `PAYPAL_MODE=sandbox` first)
- [ ] Email delivery working (test password reset)
- [ ] Resend domain verified for vonaxity.com
- [ ] Cloudinary upload working (test nurse document upload)
- [ ] AI chat (Vona) responding on homepage

---

## Cost Estimate (Monthly)

| Service | Cost |
|---|---|
| Vercel (Hobby/Pro) | Free – $20/mo |
| Railway (Starter) | ~$5–20/mo depending on usage |
| PostgreSQL (Railway) | Included in Railway plan |
| PayPal | 3.49% + fixed fee per transaction (varies by country) |
| Cloudinary (free tier) | Free up to 25GB |
| Resend | Free up to 3,000 emails/mo, then ~$20/mo |
| Twilio | ~€0.04–0.08 per SMS |
| Anthropic (Claude Haiku) | ~$0.001 per 1K input tokens (very low cost) |
| **Total (early stage)** | **~$30–60/mo** |
