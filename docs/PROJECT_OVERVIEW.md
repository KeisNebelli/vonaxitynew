# Project Overview

## What is Vonaxity?

Vonaxity is a subscription-based home nursing platform that connects Albanian families living abroad with certified nurses who visit their loved ones at home in Albania. A family member in the UK, Italy, Germany, or the USA can book a nurse visit for their parent in Tirana — and receive a health report the same day.

Founded 2026 by Keis Nebelli.

---

## Business Model

- **Clients pay a monthly subscription** (Basic €30 / Standard €50 / Premium €120) that includes a set number of nurse visits per month. Payments are processed by PayPal.
- **Nurses earn a pay-per-visit fee** set by the platform (default €20/visit). Payouts are managed manually by admins via the CRM and paid through PayPal.
- **7-day free trial** on all plans. No charge until trial ends.

---

## User Roles

| Role | Description |
|---|---|
| `CLIENT` | Family member abroad who books visits and manages the subscription |
| `NURSE` | Licensed Albanian nurse who accepts jobs, performs visits, and submits health reports |
| `ADMIN` | Platform operator — approves nurses, manages payouts, configures pricing |

Role is stored on `User.role` in the database. Protected routes are enforced in both `frontend/middleware.js` (Next.js middleware) and `backend/middleware/auth.js` (Express middleware).

---

## Core Product Flows

### 1. Client Signup Flow
1. Client visits `/[lang]/signup`
2. Completes 3-step form: account details → choose plan → add loved one's details (relative)
3. Account created with `status: TRIAL`, 7-day trial subscription created
4. Redirected to `/[lang]/dashboard`
5. After trial expires, subscription status becomes `EXPIRED` and client sees a paywall

### 2. Booking Flow
1. Client clicks "Book Visit" in the dashboard
2. Selects service type, date/time, relative, and optional notes
3. Visit created with `status: UNASSIGNED` and a unique `workOrderNumber` (e.g. `VON-2026-0001`)
4. Approved nurses in the same city are notified
5. Nurses apply via the "Find Jobs" section in their dashboard
6. Client sees applicants in "My Visits → View Applicants" and selects a nurse
7. Visit status → `ACCEPTED`, nurse is notified
8. Nurse updates status through: `ON_THE_WAY` → `ARRIVED` → `IN_PROGRESS`
9. After the visit, nurse submits a 3-step CompleteVisit report (vitals + clinical notes + condition flag)
10. Visit status → `COMPLETED`, email report sent to client

### 3. Payment Flow
1. Client clicks "Upgrade" in the Subscription section
2. Frontend calls `POST /payments/create-subscription` with the chosen plan
3. Backend gets a PayPal OAuth token, creates a PayPal subscription, returns approval URL
4. Client is redirected to PayPal's hosted approval page
5. On approval, PayPal redirects back to `/dashboard?payment=success&subscription_id=I-xxx`
6. Frontend calls `POST /payments/capture` with the subscription ID — backend verifies it's ACTIVE in PayPal and updates the DB
7. PayPal also fires `BILLING.SUBSCRIPTION.ACTIVATED` webhook to `POST /payments/webhook` (backup)
8. For cancellations: client clicks "Cancel subscription" button → `POST /payments/cancel` → PayPal API + DB update

### 4. Nurse Approval Flow
1. Nurse registers at `/[lang]/nurse-signup` — creates `User` (role: NURSE) + `Nurse` profile
2. Nurse completes onboarding in their dashboard (personal info, specialties, availability, experience, languages)
3. Nurse uploads license certificate and/or diploma (→ Cloudinary)
4. Nurse profile status changes from `INCOMPLETE` → `PENDING` (when onboarding is submitted)
5. Admin reviews the application in the CRM → views documents
6. Admin clicks "Approve" → `Nurse.status: APPROVED`, nurse receives notification
7. Or admin clicks "Reject" with a reason → `Nurse.status: REJECTED`, nurse sees rejection reason
8. Only APPROVED nurses appear in open job listings and can apply to visits

### 5. Nurse Visit Completion Flow
1. Nurse opens "Complete Visit" from the My Visits tab
2. **Step 1 — Vitals**: Blood pressure, heart rate, glucose, temperature, O₂ saturation, weight
3. **Step 2 — Clinical Notes**: Condition flag (Stable/Monitor/Escalate) + structured note sections (Assessment, Intervention, Patient Response, Follow-up, Medications)
4. **Step 3 — Review**: Full summary before submit
5. On submit: structured notes are concatenated with `[Section]` headers into a single `nurseNotes` string for API compatibility
6. `POST /visits/:id/complete` called with all vitals + `nurseNotes` + `conditionFlag`
7. Visit marked `COMPLETED`, `totalVisits` incremented on nurse record

### 6. Payout Flow (Admin-managed)
1. Admin goes to Admin CRM → Payouts
2. Clicks "Generate Payouts" for a given period (e.g. `2026-05`)
3. Backend calculates each nurse's completed visits × pay rate for that period
4. Payout records created with `status: pending`
5. Admin reviews and clicks "Approve" → `status: approved`
6. Admin pays via PayPal (manually, outside the platform) then clicks "Mark Paid" → `status: paid`, `paidAt` timestamp recorded

---

## AI Assistant (Vona)

Vona is powered by Anthropic Claude Haiku. It runs in 4 different contexts, each with a tailored system prompt:

| Context | Location | System Prompt Focus |
|---|---|---|
| `landing` | Homepage chat widget | Answers public questions, guides to signup |
| `client` | Client dashboard chat | Helps navigate dashboard, booking, subscription |
| `nurse` | Nurse dashboard chat | Profile completion, approval process, how bookings work |
| `admin` | Admin CRM chat | Summarizes CRM data, flags issues, suggests actions |

**RAG (Retrieval-Augmented Generation)**: Past Q&A pairs are stored in the `ChatLog` table. When a user asks a question, the backend retrieves the top 3 most similar past helpful answers (using Jaccard similarity) and injects them as context. Admins rated thumbs-down are excluded.

Endpoint: `POST /ai/chat`
Feedback: `POST /ai/feedback` (thumbs up/down stored on `ChatLog.helpful`)

---

## i18n (Bilingual Support)

All pages live under `/[lang]/` — either `/en/` or `/sq/` (Albanian).

- The language prefix is the first URL segment: `/en/dashboard`, `/sq/dashboard`
- `frontend/middleware.js` redirects `/dashboard` → `/en/dashboard` (using cookie `vonaxity-locale` if set)
- All UI strings are in `frontend/translations/index.js` — accessed via `t(lang, 'key.path')`
- The `lang` prop is passed down from the page component through all children
- Albanian translations are labeled `sq` (ISO 639-1 code for Albanian/Shqip)

---

## Geographic Scope

Currently live: **Tirana** and **Durrës** (Albania).

Planned expansion: Elbasan, Fier, Berat, Sarandë, Kukës, Shkodër.

Nurses are matched to visits by city. A Tirana nurse only sees Tirana jobs.

---

## Non-Emergency Disclaimer

Vonaxity is **not** an emergency medical service. For emergencies in Albania, call **127**. This disclaimer appears in the footer, on booking forms, on the pricing page, and inside both dashboards.
