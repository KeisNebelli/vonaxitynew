# Vonaxity — Handover Plan

This document is the step-by-step plan for handing Vonaxity over to a new owner, developer team, or acquirer. It is written specifically for this codebase and infrastructure — not a generic template.

Run through this in order. Do not skip phases.

---

## Overview

```
Phase 1 — Prepare (2–4 weeks before handover)
Phase 2 — Stabilise (1 week before handover)
Phase 3 — Transfer Day (handover day itself)
Phase 4 — Shadowing Period (first 2 weeks after)
Phase 5 — Cut the cord (clean exit)
```

Total time from decision to clean exit: **4–6 weeks**

---

## Phase 1 — Prepare (2–4 weeks before)

The goal here is to make the codebase and infrastructure handover-ready before anyone else touches it. Do this before any NDAs are signed or due diligence begins.

### 1.1 — Fix the known spaghetti code

These are the highest-risk items for a new developer to trip on. Fix them before handover — they will ask about them during due diligence.

| Task | File(s) | Effort | Why it matters |
|---|---|---|---|
| Extract `NotificationBell` to shared component | `nurse/page.jsx`, `dashboard/page.jsx` | 30 min | Same component copy-pasted in 2 files — bug in one won't be fixed in the other |
| Move AI prompts out of `server.js` | `backend/server.js` → `backend/lib/aiPrompts.js` | 1 hour | 371 of 559 lines in the server entry point are AI strings — intimidating for a new dev |
| Split `backend/routes/other.js` | → `routes/users.js`, `routes/notifications.js`, `routes/settings.js`, `routes/contact.js` | 2 hours | 10 unrelated routers in one file. New devs can't find anything |
| Create `frontend/lib/colors.js` | All 19 files redefining `C = { primary... }` | 1 hour | Brand colour is hardcoded 19 times. One change = 19 file edits |
| Add `frontend/lib/serviceNames.js` | `trService()` only in `nurse/page.jsx` | 30 min | Service name translation missing from admin and client views |

These are safe to do — no UI change, no logic change. See [`FEATURE_MAP.md`](FEATURE_MAP.md) for where everything lives.

### 1.2 — Verify all environment variables are set correctly in production

Go through [`ENV_VARIABLES.md`](ENV_VARIABLES.md) line by line and confirm every variable is set in Railway and Vercel.

- [ ] `DATABASE_URL` — Railway Postgres
- [ ] `JWT_SECRET` — strong, 64+ chars
- [ ] `FRONTEND_URL` — `https://vonaxity.com`
- [ ] `STRIPE_SECRET_KEY` — live key (`sk_live_`)
- [ ] `STRIPE_WEBHOOK_SECRET` — from Stripe dashboard
- [ ] `STRIPE_PRICE_BASIC`, `STRIPE_PRICE_STANDARD`, `STRIPE_PRICE_PREMIUM`
- [ ] `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- [ ] `RESEND_API_KEY`, `EMAIL_FROM`
- [ ] `ANTHROPIC_API_KEY`
- [ ] `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- [ ] Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_BASE_URL`

### 1.3 — Take a full database backup

```bash
# Run this from your local machine against the production DB
pg_dump "<railway-postgres-url>" > vonaxity_backup_$(date +%Y%m%d).sql
```

Store the backup somewhere safe (not in the repo). Take a fresh one every week until handover is complete.

### 1.4 — Document all active users and subscriptions

Pull a summary from the production database before handover:

```bash
# From Prisma Studio or psql
SELECT COUNT(*) FROM "User" WHERE role = 'CLIENT';
SELECT COUNT(*) FROM "User" WHERE role = 'NURSE';
SELECT COUNT(*) FROM "Nurse" WHERE status = 'APPROVED';
SELECT COUNT(*) FROM "Subscription" WHERE status IN ('ACTIVE', 'TRIAL');
SELECT COUNT(*) FROM "Visit" WHERE status = 'COMPLETED';
```

Hand this summary to the new owner — it's part of the business valuation and the new owner's baseline.

### 1.5 — Document all active Stripe subscriptions

Log into Stripe Dashboard → Customers. Export the list of active subscribers. The new owner needs to know exactly who is paying and what plan they're on.

### 1.6 — Ensure monitoring exists

Before handover, the new owner needs visibility. Set up at minimum:

- **Uptime monitoring**: Add `https://vonaxitynew-production.up.railway.app/health` to [UptimeRobot](https://uptimerobot.com) (free). Email alerts on downtime.
- **Error visibility**: If not already done, add basic Railway log alerts for `console.error` output
- **Stripe alerts**: Enable payment failure email alerts in Stripe Dashboard → Settings → Email notifications

### 1.7 — Write a 1-page "known issues" note

Be honest. List anything that's broken, half-built, or needs attention:

- Any features that are UI-only with no backend (e.g. buttons that do nothing)
- Any known bugs that haven't been fixed
- Any technical debt beyond what's in the docs
- Current active customer complaints

This protects you legally and builds trust with the new owner.

---

## Phase 2 — Stabilise (1 week before)

The goal is a clean, stable, fully-documented codebase that passes a basic sanity check.

### 2.1 — Run through the full product as each user role

Go through every flow manually on production. Check off:

**As a Client:**
- [ ] Sign up with a new email → trial starts
- [ ] Book a visit → work order created, nurses notified
- [ ] See applicants → select a nurse
- [ ] View visit in calendar
- [ ] Upgrade to a paid plan (use Stripe test card `4242 4242 4242 4242`)
- [ ] View health records
- [ ] Download PDF report on a completed visit
- [ ] Rate a visit
- [ ] Change language EN ↔ SQ

**As a Nurse:**
- [ ] Register and complete onboarding
- [ ] Upload license document
- [ ] Browse open jobs
- [ ] Apply to a visit
- [ ] Update visit status (On the Way → Arrived → In Progress)
- [ ] Complete visit with vitals and notes (all 3 steps)
- [ ] View job history
- [ ] Print PDF report

**As an Admin:**
- [ ] Approve a nurse
- [ ] Reject a nurse with a reason
- [ ] View platform analytics
- [ ] Generate and approve a payout
- [ ] Change pricing settings
- [ ] Send an announcement notification

**AI Assistant:**
- [ ] Chat with Vona on the homepage
- [ ] Chat with Vona in the client dashboard
- [ ] Chat with Vona in the nurse dashboard
- [ ] Chat with Vona in admin CRM

### 2.2 — Confirm docs are up to date

Re-read each doc in `/docs` and update anything that changed since it was written. Pay particular attention to:
- API routes (did any new endpoints get added?)
- ENV variables (did any new keys get added?)
- Handoff checklist (are all account names correct?)

### 2.3 — Freeze features

Stop adding new features at least 1 week before handover. Bug fixes only. The codebase the new owner receives should be stable, not mid-flight.

### 2.4 — Git hygiene

```bash
# Make sure main branch is clean
git status              # nothing uncommitted
git log --oneline -10   # recent commits look sensible

# Tag the handover version
git tag -a v1.0-handover -m "Handover-ready release $(date +%Y-%m-%d)"
git push origin --tags
```

---

## Phase 3 — Transfer Day

This is the actual handover session. Plan 3–4 hours. Do it over a video call with screen sharing. Have the new owner's screen visible so you can watch them do each step.

### 3.1 — Transfer accounts in this order

**1. GitHub** (do this first — it unlocks everything else)
- Settings → Collaborators → Add new owner as Admin
- OR: Settings → Danger Zone → Transfer Repository (if full transfer)
- New owner should confirm they can see the repo and clone it

**2. Vercel**
- Vercel Dashboard → Team Settings → Members → Invite new owner as Owner
- OR: new owner creates their own Vercel project from the transferred GitHub repo
- Confirm auto-deploy is still working: push a small commit, watch deploy succeed

**3. Railway**
- Railway Dashboard → Project → Settings → Members → Add new owner
- OR: new owner creates new Railway project from the transferred GitHub repo and migrates the DB
- Confirm `/health` returns 200 after any migration

**4. Domain registrar**
- Transfer the domain or add new owner as admin
- Make sure DNS stays pointing to Vercel during transfer (don't touch nameservers mid-handover)

**5. Stripe**
- Dashboard → Settings → Team → Add new owner as Administrator
- Walk through: Products, Prices, Webhook endpoints, Active subscriptions

**6. Cloudinary**
- Add new owner as Admin in Cloudinary team settings
- Confirm uploaded files (nurse docs/photos) are still accessible

**7. Resend**
- Add new owner to Resend team
- Confirm `vonaxity.com` domain is still verified

**8. Twilio**
- Add new owner to Twilio project team
- Walk through active phone numbers and usage

**9. Anthropic**
- New owner creates their own Anthropic account and API key
- Update `ANTHROPIC_API_KEY` in Railway with new key
- Old key can be revoked immediately

**10. Business email** (`hello@vonaxity.com`)
- Transfer email account or set up forwarding
- Update any auto-replies or signatures

### 3.2 — Walk through the codebase together (1 hour)

Screen share the codebase. Cover these in order:

1. **Repo structure** — show `README.md`, point to `/docs`, explain the two-app structure
2. **How to run it locally** — run through `SETUP_GUIDE.md` together; new owner should have it running on their machine by end of call
3. **The three big pages** — open `nurse/page.jsx`, `dashboard/page.jsx`, `admin/page.jsx` and explain the component structure at a high level
4. **The booking flow** — open `backend/routes/visits.js`, walk through the comment at the top and the key endpoints
5. **Stripe** — open `backend/routes/payments.js`, explain the webhook and why raw body matters
6. **The AI assistant** — open `backend/server.js`, explain the `SYSTEM_BASE` prompts and the RAG setup
7. **Database** — open Prisma Studio together: `npx prisma studio` — walk through the main tables
8. **How to deploy** — make a small code change together and push it; watch both Vercel and Railway deploy

### 3.3 — Hand over this checklist

Give them:
- This document
- `docs/HANDOFF_CHECKLIST.md` with all account names/URLs filled in
- The latest database backup file
- A written list of all active paying customers (from Stripe export)
- The "known issues" note from Phase 1.7

### 3.4 — Rotate secrets

After all accounts are transferred:

1. **Generate a new `JWT_SECRET`** — update in Railway, accept that all active users get logged out once
2. **Roll Stripe keys** — new owner generates new API keys in Stripe; old keys are revoked
3. **Roll Cloudinary keys** — new owner generates new API keys; old revoked
4. **Roll Resend key** — new owner generates new key; old revoked

You should end the handover with zero access to production.

---

## Phase 4 — Shadowing Period (first 2 weeks after)

The new owner is live but you're available. Define this upfront in writing so both sides have clear expectations.

### What you cover:
- Answer questions about the codebase or business logic
- Help debug any unexpected production issues
- Join one call per week maximum (or as agreed)

### What you don't cover:
- Building new features
- Fixing bugs that existed before handover (those are in the known issues note)
- Anything outside the agreed support scope

### Recommended structure:
- **Week 1**: Available on WhatsApp/Slack for quick questions, daily
- **Week 2**: Available for one scheduled call, async questions only

After 2 weeks: clean exit. The new owner is on their own.

---

## Phase 5 — Clean Exit

Once the shadowing period ends:

- [ ] Remove yourself from GitHub repo (confirm new owner has Owner access first)
- [ ] Remove yourself from Vercel
- [ ] Remove yourself from Railway
- [ ] Remove yourself from Stripe
- [ ] Remove yourself from Cloudinary, Resend, Twilio, Anthropic
- [ ] Remove access to domain registrar
- [ ] Delete any local copies of production `.env` files from your machine
- [ ] Confirm with new owner in writing that handover is complete and accepted

---

## Emergency Contacts to Leave the New Owner

Document and hand over contact info for:

| Service | Support |
|---|---|
| Railway | railway.app/help — Discord community is very active |
| Vercel | vercel.com/support |
| Stripe | support.stripe.com — live chat available |
| Twilio | support.twilio.com |
| Resend | resend.com/docs + Discord |
| Anthropic | console.anthropic.com/support |
| Cloudinary | cloudinary.com/support |

---

## What Will Break If Not Done Right

These are the most likely failure points during handover — based on this specific codebase:

| Risk | What happens | Prevention |
|---|---|---|
| DNS misconfiguration | `vonaxity.com` goes down during domain transfer | Do domain transfer last, after all other accounts are transferred; use Vercel's DNS guide exactly |
| Stripe webhook URL not updated | Payments succeed but subscriptions don't activate | After any backend URL change, update the webhook endpoint in Stripe Dashboard immediately |
| JWT_SECRET rotated without warning | All logged-in users get logged out simultaneously | Send a platform email 24h before rotating; rotate during low-traffic hours |
| Database not backed up before migration | Data loss on schema changes | Always backup before `prisma migrate deploy`, even if automated |
| Anthropic key not replaced | AI chat goes silent | New owner generates their own key before old one is revoked |
| `EMAIL_FROM` domain not re-verified | Password reset emails fail silently | New owner must verify `vonaxity.com` in their Resend account |

---

## Estimated Time Per Phase

| Phase | Who | Time |
|---|---|---|
| Phase 1 — Prepare | Current owner + optionally a dev | 2–4 weeks (mostly waiting + testing) |
| Phase 2 — Stabilise | Current owner | 1 week |
| Phase 3 — Transfer Day | Both parties, together | 3–4 hours on a call |
| Phase 4 — Shadowing | Current owner (part-time) | 2 weeks |
| Phase 5 — Clean exit | Both parties | 30 minutes |
| **Total** | | **5–8 weeks from decision to done** |
