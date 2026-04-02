# Vonaxity — Home Nurse Visits in Albania

Subscription-based home healthcare platform for Albania.
Built with Next.js (frontend) + Express/PostgreSQL (backend).

---

## 📁 Project Structure

```
vonaxity/
├── frontend/     ← Next.js website + all 3 portals
└── backend/      ← Express API + PostgreSQL database
```

---

## 🚀 Quick Start (Run Locally)

### Step 1 — Install PostgreSQL
Download and install PostgreSQL from https://postgresql.org/download
Then create a database:
```
psql -U postgres
CREATE DATABASE vonaxity;
\q
```

### Step 2 — Set up the Backend

```bash
cd vonaxity/backend

# 1. Install dependencies
npm install

# 2. Copy env file and fill in your values
cp .env.example .env

# Open .env and set:
# DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/vonaxity
# JWT_SECRET=any-random-string-at-least-32-characters-long
# (leave Stripe and Twilio as-is for now — test version works without them)

# 3. Run database migration (creates all tables)
npx prisma migrate dev --name init

# 4. Seed test data (creates 3 test accounts)
npm run db:seed

# 5. Start the backend server
npm run dev
```

Backend will run at: http://localhost:4000
Test it: http://localhost:4000/health

---

### Step 3 — Set up the Frontend

```bash
cd vonaxity/frontend

# 1. Install dependencies
npm install

# 2. Copy env file
cp .env.example .env.local

# (No changes needed for local testing — defaults point to localhost:4000)

# 3. Start the frontend
npm run dev
```

Frontend will run at: http://localhost:3000

---

## 🔑 Test Accounts

| Role   | Email             | Password |
|--------|-------------------|----------|
| Client | client@test.com   | test123  |
| Nurse  | nurse@test.com    | test123  |
| Admin  | admin@test.com    | test123  |

These are created automatically when you run `npm run db:seed`.

---

## 🌐 Pages & Portals

| URL                        | What it is              |
|----------------------------|-------------------------|
| localhost:3000/en          | Homepage (English)      |
| localhost:3000/sq          | Homepage (Albanian)     |
| localhost:3000/en/login    | Login (all roles)       |
| localhost:3000/en/signup   | Client signup           |
| localhost:3000/en/dashboard | Client portal          |
| localhost:3000/en/nurse    | Nurse panel             |
| localhost:3000/en/admin    | Admin dashboard         |
| localhost:3000/en/pricing  | Pricing page            |
| localhost:3000/en/about    | About us                |
| localhost:3000/en/contact  | Contact                 |
| localhost:3000/en/faq      | FAQ                     |
| localhost:3000/en/how-it-works | How it works       |
| localhost:3000/en/services | Services                |

---

## 🚢 Deploy to Production

### Frontend → Vercel (free)
```bash
cd vonaxity/frontend
npx vercel
```
Set environment variable in Vercel dashboard:
- NEXT_PUBLIC_API_URL = your Railway backend URL

### Backend → Railway (free tier available)
1. Go to railway.app and create a new project
2. Connect your GitHub repo
3. Select the `vonaxity/backend` folder
4. Add a PostgreSQL service in Railway
5. Set environment variables (copy from .env, use Railway's DATABASE_URL)
6. Deploy

---

## 🔧 What's Included (Test Version)

✅ Public website — homepage, pricing, services, how it works, about, contact, FAQ
✅ English + Albanian language toggle
✅ Client signup flow (3 steps)
✅ Login with role-based redirect
✅ Client dashboard — visits, subscription, overview
✅ Nurse panel — dashboard, visits list, complete visit form, earnings
✅ Admin dashboard — overview, nurse management (approve/suspend), client list, visit assignment, payments, settings
✅ Full REST API — auth, visits, nurses, users, payments, analytics
✅ PostgreSQL database with Prisma ORM
✅ Test seed data with 3 accounts

## 🔜 Phase 2 (Not included yet)

⬜ Real Stripe payment processing
⬜ Twilio SMS notifications
⬜ Email health reports
⬜ Real-time visit tracking
⬜ Nurse profile photos
⬜ Google Maps integration
⬜ Mobile app

---

## ❓ Common Issues

**"Cannot connect to database"**
→ Make sure PostgreSQL is running and your DATABASE_URL password is correct

**"Module not found"**
→ Run `npm install` again in both frontend/ and backend/ folders

**"Prisma Client not found"**
→ Run `npx prisma generate` in the backend/ folder

**Login not working**
→ Make sure you ran `npm run db:seed` to create test accounts
→ Make sure backend is running on port 4000

---

## 📞 Support

Email: hello@vonaxity.com
Emergency in Albania: 127

⚠️ Vonaxity is non-emergency care only.
