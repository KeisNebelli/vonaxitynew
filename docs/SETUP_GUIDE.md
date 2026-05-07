# Setup Guide — Local Development

Follow this guide to run Vonaxity fully on your local machine.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | Comes with Node |
| PostgreSQL | 14+ | https://postgresql.org/download |
| Git | any | https://git-scm.com |

Optional (for file uploads in dev):
- Cloudinary account (free tier works) — https://cloudinary.com

---

## Step 1 — Clone the Repository

```bash
git clone https://github.com/KeisNebelli/vonaxitynew.git
cd vonaxitynew
```

The repo contains two apps in one:
- `frontend/` — Next.js app
- `backend/` — Express API

---

## Step 2 — Create a Local Database

```bash
# Start PostgreSQL (if not already running as a service)
# On Mac with Homebrew:
brew services start postgresql@14

# Create the database
psql -U postgres -c "CREATE DATABASE vonaxity;"
```

Or use a GUI like TablePlus or pgAdmin to create a database named `vonaxity`.

---

## Step 3 — Configure the Backend

```bash
cd backend
cp .env.example .env   # if no .env.example exists, create .env manually
```

Edit `.env` and set at minimum:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/vonaxity
JWT_SECRET=any-random-string-at-least-32-characters-long
PORT=4000
FRONTEND_URL=http://localhost:3000

# Leave these blank for local dev (features degrade gracefully without them):
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox
PAYPAL_PLAN_BASIC=
PAYPAL_PLAN_STANDARD=
PAYPAL_PLAN_PREMIUM=
PAYPAL_WEBHOOK_ID=
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

> **Note**: The app runs without PayPal, Twilio, Resend, and Cloudinary locally. Payments, SMS, emails, and file uploads will fail gracefully with error messages.

---

## Step 4 — Install Backend Dependencies and Migrate

```bash
# Still in backend/
npm install

# Create all database tables from the Prisma schema
npx prisma migrate dev --name init

# Verify Prisma client is generated
npx prisma generate
```

---

## Step 5 — Seed Test Data

```bash
npm run db:seed
```

This creates:

| Role | Email | Password |
|---|---|---|
| Admin | admin@test.com | test123 |
| Client | client@test.com | test123 |
| Nurse | nurse@test.com | test123 |

---

## Step 6 — Start the Backend

```bash
npm run dev
```

Backend runs at: **http://localhost:4000**

Test it: http://localhost:4000/health → should return `{"status":"ok",...}`

---

## Step 7 — Configure the Frontend

Open a new terminal:

```bash
cd ../frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

---

## Step 8 — Install Frontend Dependencies and Start

```bash
npm install
npm run dev
```

Frontend runs at: **http://localhost:3000**

The app will redirect `/` → `/en` (English) automatically.

---

## Step 9 — Verify Everything Works

Open http://localhost:3000 and confirm:
- [ ] Homepage loads
- [ ] Language toggle works (EN ↔ SQ)
- [ ] Login with `client@test.com` / `test123` → redirects to `/en/dashboard`
- [ ] Login with `nurse@test.com` / `test123` → redirects to `/en/nurse`
- [ ] Login with `admin@test.com` / `test123` → redirects to `/en/admin`

---

## Useful Dev Commands

### Backend

```bash
npm run dev          # Start with nodemon (auto-restart on file change)
npm run db:migrate   # Run new migrations
npm run db:seed      # Re-seed test data
npm run db:studio    # Open Prisma Studio GUI at http://localhost:5555
```

### Frontend

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run start        # Run production build locally
```

---

## Database Inspection

```bash
# Prisma Studio — GUI for viewing/editing database rows
cd backend
npx prisma studio
```

Or connect with any PostgreSQL client (TablePlus, pgAdmin, DBeaver) using the `DATABASE_URL` from your `.env`.

---

## Adding a New Translation String

1. Open `frontend/translations/index.js`
2. Add the key under `en` (English)
3. Add the Albanian translation under `sq`
4. Use in a component: `t(lang, 'your.new.key')`

---

## Common Local Dev Issues

See [`TROUBLESHOOTING.md`](TROUBLESHOOTING.md) for a full list.

Quick fixes:
- `Cannot find module '@prisma/client'` → run `npx prisma generate` in `backend/`
- `CORS error` → confirm `FRONTEND_URL=http://localhost:3000` in backend `.env`
- `401 Unauthorized` → token may have expired; log out and log in again
- Port 4000 already in use → `lsof -ti:4000 | xargs kill` then restart
