# Vonaxity

> Professional home nursing care for Albanian families — bookable from anywhere in the world.

Vonaxity connects families living abroad (UK, Italy, Germany, USA, etc.) with certified nurses who visit their loved ones at home in Albania. Founded 2026 by Keis Nebelli.

---

## What It Does

- **Clients** (families abroad) subscribe, book nurse visits for a family member in Albania, and receive a health report after every visit.
- **Nurses** (licensed Albanian nurses) apply for open visits, perform the visit, and submit a structured health report (vitals + clinical notes) through a 3-step wizard.
- **Admins** manage nurse approvals, subscriptions, payouts, platform settings, and monitor analytics via a built-in CRM.
- **Vona** — an AI assistant (Claude Haiku) — answers questions on the landing page, inside the client dashboard, nurse dashboard, and admin CRM.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React 18 |
| Styling | Inline styles only (no CSS framework) |
| Backend | Node.js + Express |
| ORM | Prisma |
| Database | PostgreSQL (hosted on Railway) |
| Auth | JWT — stored in `localStorage` + cookie |
| Payments | PayPal (monthly subscriptions) |
| File uploads | Cloudinary |
| Email | Resend |
| SMS | Twilio |
| AI assistant | Anthropic Claude Haiku 4.5 |
| Frontend hosting | Vercel |
| Backend hosting | Railway |
| i18n | Custom bilingual EN / Albanian (SQ) via `[lang]` URL prefix |

---

## Project Structure

```
vonaxity/
├── README.md
├── frontend/                      # Next.js application → Vercel
│   ├── app/
│   │   ├── [lang]/                # All bilingual pages
│   │   │   ├── page.jsx           # Homepage / landing
│   │   │   ├── dashboard/         # Client dashboard (visits, health, billing)
│   │   │   ├── nurse/             # Nurse dashboard (jobs, visits, complete wizard)
│   │   │   ├── admin/             # Admin CRM
│   │   │   ├── signup/            # Client registration
│   │   │   ├── nurse-signup/      # Nurse registration
│   │   │   ├── login/
│   │   │   ├── pricing/
│   │   │   ├── nurses/            # Public nurse directory
│   │   │   └── [about|contact|faq|services|how-it-works|terms|privacy]/
│   │   └── api/pricing/           # Next.js API route (reads pricing from backend)
│   ├── components/
│   │   ├── layout/                # Nav, Footer
│   │   ├── chat/                  # Vona AI chat (3 variants: landing, client, nurse)
│   │   ├── map/                   # MapComponent, VisitLocationCard, NavigationButton
│   │   ├── ui/                    # Toast notifications, NurseAvatar
│   │   └── visuals/               # SVG illustrations, step animations
│   ├── context/
│   │   └── AuthContext.jsx        # React context — user session state
│   ├── hooks/
│   │   ├── useLang.js             # Reads [lang] from URL
│   │   └── useNurseLocation.js    # Browser geolocation for nurses
│   ├── lib/
│   │   ├── api.js                 # All frontend → backend API calls
│   │   └── design.js              # Shared design tokens
│   ├── translations/
│   │   └── index.js               # All bilingual strings (EN + SQ)
│   └── middleware.js              # Route guards + language redirect
│
├── backend/                       # Express API → Railway
│   ├── server.js                  # Entry point, rate limiting, AI proxy, trial sweep
│   ├── routes/
│   │   ├── auth.js                # Register, login, forgot/reset password
│   │   ├── visits.js              # Bookings, status updates, completion, vitals
│   │   ├── nurses.js              # Nurse profiles, onboarding, approval
│   │   ├── payments.js            # PayPal subscriptions, capture, cancel, webhook
│   │   ├── payouts.js             # Nurse payout generation and management
│   │   ├── uploads.js             # Cloudinary file uploads (nurse docs + photos)
│   │   └── other.js               # Users, notifications, analytics, settings, contact
│   ├── middleware/
│   │   └── auth.js                # JWT verification + role guard factory
│   ├── lib/
│   │   ├── db.js                  # Prisma client singleton
│   │   ├── email.js               # Resend email helpers
│   │   └── notifications.js       # In-app notification helpers
│   └── prisma/
│       ├── schema.prisma          # Full database schema (source of truth)
│       └── seed.js                # Dev seed — creates 3 test accounts
│
└── docs/                          # All handoff documentation
    ├── PROJECT_OVERVIEW.md
    ├── SETUP_GUIDE.md
    ├── DEPLOYMENT_GUIDE.md
    ├── DATABASE_SCHEMA.md
    ├── FEATURE_MAP.md
    ├── API_ROUTES.md
    ├── ENV_VARIABLES.md
    ├── TROUBLESHOOTING.md
    └── HANDOFF_CHECKLIST.md
```

---

## Quick Start (Local Development)

```bash
# 1. Clone
git clone https://github.com/KeisNebelli/vonaxitynew.git
cd vonaxitynew

# 2. Backend
cd backend
cp .env.example .env          # fill in all values — see docs/ENV_VARIABLES.md
npm install
npx prisma migrate dev
npm run db:seed               # creates 3 test accounts
npm run dev                   # http://localhost:4000

# 3. Frontend (new terminal)
cd ../frontend
cp .env.example .env.local    # set NEXT_PUBLIC_API_URL=http://localhost:4000
npm install
npm run dev                   # http://localhost:3000
```

**Test accounts** (created by seed):

| Role | Email | Password |
|---|---|---|
| Client | client@test.com | test123 |
| Nurse | nurse@test.com | test123 |
| Admin | admin@test.com | test123 |

See [`docs/SETUP_GUIDE.md`](docs/SETUP_GUIDE.md) for the full guide.

---

## Deploy

| Service | Platform | Trigger |
|---|---|---|
| Frontend | Vercel | Auto-deploy on push to `main` |
| Backend | Railway | Auto-deploy on push to `main` |

See [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md) for the full guide.

---

## Key Files at a Glance

| Purpose | File |
|---|---|
| All API calls (frontend) | `frontend/lib/api.js` |
| Database schema | `backend/prisma/schema.prisma` |
| Route guards + i18n redirect | `frontend/middleware.js` |
| JWT auth middleware | `backend/middleware/auth.js` |
| PayPal payment flow | `backend/routes/payments.js` |
| Visit booking + completion | `backend/routes/visits.js` |
| Nurse approval flow | `backend/routes/nurses.js` |
| AI assistant (Vona) | `backend/server.js` → `/ai/chat` |
| All bilingual strings | `frontend/translations/index.js` |
| Client dashboard | `frontend/app/[lang]/dashboard/page.jsx` |
| Nurse dashboard | `frontend/app/[lang]/nurse/page.jsx` |
| Admin CRM | `frontend/app/[lang]/admin/page.jsx` |

---

## Documentation Index

| Doc | What's Inside |
|---|---|
| [`docs/PROJECT_OVERVIEW.md`](docs/PROJECT_OVERVIEW.md) | Business model, user roles, all product flows |
| [`docs/SETUP_GUIDE.md`](docs/SETUP_GUIDE.md) | Local dev from scratch |
| [`docs/DEPLOYMENT_GUIDE.md`](docs/DEPLOYMENT_GUIDE.md) | Railway + Vercel production deploy |
| [`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md) | Every table, field, relationship, and enum |
| [`docs/FEATURE_MAP.md`](docs/FEATURE_MAP.md) | Every feature and where its code lives |
| [`docs/API_ROUTES.md`](docs/API_ROUTES.md) | All backend endpoints with method, auth, and params |
| [`docs/ENV_VARIABLES.md`](docs/ENV_VARIABLES.md) | Every env variable — what it does and where to get it |
| [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) | Known issues and fixes |
| [`docs/HANDOFF_CHECKLIST.md`](docs/HANDOFF_CHECKLIST.md) | Accounts, credentials, hosting info for handoff/sale |

---

## Contact

- **Founder**: Keis Nebelli — CEO & Founder
- **Support**: hello@vonaxity.com
- **Emergency in Albania**: 127 (Vonaxity is non-emergency care only)
