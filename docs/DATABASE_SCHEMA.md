# Database Schema

The database is **PostgreSQL**, managed with **Prisma ORM**.

Schema file: `backend/prisma/schema.prisma`

---

## Enum Values (stored as strings)

Prisma uses `String` fields (not native enums) for compatibility. Valid values:

| Field | Valid Values |
|---|---|
| `User.role` | `CLIENT` · `NURSE` · `ADMIN` |
| `User.status` | `ACTIVE` · `TRIAL` · `SUSPENDED` · `CANCELLED` |
| `Nurse.status` | `INCOMPLETE` · `PENDING` · `APPROVED` · `REJECTED` · `SUSPENDED` |
| `Visit.status` | `UNASSIGNED` · `PENDING` · `ACCEPTED` · `ON_THE_WAY` · `ARRIVED` · `IN_PROGRESS` · `COMPLETED` · `NO_SHOW` · `CANCELLED` |
| `Subscription.status` | `TRIAL` · `ACTIVE` · `PAST_DUE` · `CANCELLED` · `FAILED` · `EXPIRED` |
| `VisitApplication.status` | `PENDING` · `ACCEPTED` · `REJECTED` |
| `Payout.status` | `pending` · `approved` · `paid` · `rejected` |

---

## Tables

### `User`

The base account for all three roles.

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `name` | String | Full name |
| `email` | String | Unique — used for login |
| `phone` | String? | Optional |
| `passwordHash` | String | bcryptjs hash |
| `role` | String | `CLIENT` · `NURSE` · `ADMIN` |
| `status` | String | `ACTIVE` · `TRIAL` · `SUSPENDED` · `CANCELLED` |
| `country` | String? | Country of residence (for clients abroad) |
| `city` | String? | City in Albania (for nurses) |
| `language` | String | `en` or `sq` — preferred UI language |
| `createdAt` | DateTime | Auto |
| `updatedAt` | DateTime | Auto |

Relations: `nurseProfile` (Nurse?), `subscription` (Subscription?), `relatives` (Relative[]), `payments` (Payment[]), `notifications` (Notification[])

---

### `Nurse`

Extended profile for nurse users. Always linked 1:1 to a `User`.

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `userId` | String | FK → User (unique) |
| `status` | String | `INCOMPLETE` → `PENDING` → `APPROVED` |
| `city` | String | City in Albania where nurse operates |
| `rating` | Float | Average rating (0 if no reviews yet) |
| `totalVisits` | Int | Incremented on each completed visit |
| `totalEarnings` | Float | Running total |
| `payRatePerVisit` | Float | Default 20 (€20/visit) |
| `availability` | String | JSON array of available days e.g. `["Monday","Wednesday"]` |
| `licenseNumber` | String? | Albanian nursing license number |
| `issuingAuthority` | String? | e.g. "Order of Nurses of Albania" |
| `bio` | String? | Personal bio text |
| `experience` | String? | e.g. "3-5 years" |
| `languages` | String | JSON array e.g. `["Albanian","English"]` |
| `specialties` | String | JSON array e.g. `["Blood Pressure","Glucose Monitoring"]` |
| `services` | String | JSON array of offered services |
| `diplomaUrl` | String? | Cloudinary URL — diploma scan |
| `licenseUrl` | String? | Cloudinary URL — license scan |
| `profilePhotoUrl` | String? | Cloudinary URL — headshot |
| `paypalEmail` | String? | PayPal email for receiving payouts |
| `rejectionReason` | String? | Set when admin rejects application |
| `submittedAt` | DateTime? | When nurse submitted for review |
| `approvedAt` | DateTime? | When admin approved |

Relations: `visits` (Visit[]), `reviews` (Review[]), `payouts` (Payout[]), `applications` (VisitApplication[])

> **Note**: `availability`, `languages`, `specialties`, `services` are stored as JSON strings. Parse with `JSON.parse()` before use. This was a design choice to avoid array types for cross-database compatibility.

---

### `Relative`

A family member in Albania that a client adds to their account for visits.

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `clientId` | String | FK → User |
| `name` | String | Patient's full name |
| `age` | Int? | Age in years |
| `phone` | String? | Contact number in Albania |
| `city` | String | City in Albania — used for nurse matching |
| `address` | String | Full home address |
| `relationship` | String? | e.g. "Mother", "Father", "Grandmother" |
| `healthNotes` | String? | Pre-existing conditions, allergies, medications |

Relations: `visits` (Visit[])

---

### `Subscription`

One subscription per client. Managed by PayPal. Trial is created at signup, upgraded to ACTIVE after payment.

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `userId` | String | FK → User (unique) |
| `plan` | String | `basic` · `standard` · `premium` |
| `status` | String | `TRIAL` · `ACTIVE` · `PAST_DUE` · `CANCELLED` · `FAILED` · `EXPIRED` |
| `paypalSubId` | String? | PayPal subscription ID (e.g. `I-...`) |
| `visitsPerMonth` | Int | Allowed visits — set by plan (1/2/4) |
| `visitsUsed` | Int | How many visits booked this cycle |
| `currentPeriodStart` | DateTime? | Billing period start |
| `currentPeriodEnd` | DateTime? | Billing period end |
| `trialEndsAt` | DateTime? | When free trial expires (7 days from signup) |
| `cancelledAt` | DateTime? | When subscription was cancelled |

> **Trial expiry**: The server runs a sweep every hour (`setInterval`) that marks expired trials (`trialEndsAt < now && status === 'TRIAL'`) as `EXPIRED`. This is in `server.js` — the `expireTrials()` function.

---

### `Visit`

A single nurse home visit / work order.

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `workOrderNumber` | String? | Unique human-readable ID e.g. `VON-2026-0001` |
| `relativeId` | String | FK → Relative |
| `nurseId` | String? | FK → Nurse (null until nurse is assigned) |
| `serviceType` | String | e.g. `"Blood Pressure Check"` |
| `status` | String | Full lifecycle — see enum values above |
| `scheduledAt` | DateTime | When the visit is booked for |
| `startedAt` | DateTime? | When nurse marked `IN_PROGRESS` |
| `completedAt` | DateTime? | When nurse submitted completion report |
| `notes` | String? | Client's booking notes for the nurse |
| `bpSystolic` | Int? | Blood pressure — systolic (mmHg) |
| `bpDiastolic` | Int? | Blood pressure — diastolic (mmHg) |
| `heartRate` | Int? | Heart rate (bpm) |
| `glucose` | Float? | Blood glucose (mmol/L) |
| `temperature` | Float? | Body temperature (°C) |
| `oxygenSat` | Float? | Oxygen saturation (%) |
| `nurseNotes` | String? | Clinical notes from the nurse. For structured notes, sections are delimited with `[Assessment]`, `[Intervention]`, `[Patient Response]`, `[Follow-up]`, `[Medications]`, `[Condition]` headers |
| `reportSent` | Boolean | Whether email report has been sent to client |

Relations: `review` (Review?), `applications` (VisitApplication[])

> **Note**: Blood pressure is stored as two separate integer fields (`bpSystolic`, `bpDiastolic`) rather than a string. The frontend displays them as `120/80`. Legacy visits may have `bp` as a string in the nurse notes — the CompleteVisit wizard sends both.

---

### `VisitApplication`

When a nurse applies to an open visit. Many nurses can apply to one visit; only one is selected.

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `visitId` | String | FK → Visit |
| `nurseId` | String | FK → Nurse |
| `status` | String | `PENDING` · `ACCEPTED` · `REJECTED` |
| `message` | String? | Optional cover message from nurse |
| `createdAt` | DateTime | Auto |

Unique constraint: `(visitId, nurseId)` — a nurse can only apply once per visit.

---

### `Review`

One review per visit, left by the client after completion.

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `visitId` | String | FK → Visit (unique — one review per visit) |
| `nurseId` | String | FK → Nurse |
| `rating` | Int | 1–5 stars |
| `comment` | String? | Optional written review |
| `createdAt` | DateTime | Auto |

When a review is created, the nurse's `rating` (average) is recalculated in the `POST /visits/:id/review` endpoint.

---

### `Payment`

A record of each PayPal payment event.

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `userId` | String | FK → User |
| `paypalId` | String? | PayPal transaction or sale ID |
| `amount` | Float | Amount in euros |
| `currency` | String | Default `eur` |
| `status` | String | e.g. `succeeded`, `failed` |
| `description` | String? | e.g. `"Standard plan subscription"` |

---

### `Payout`

Nurse payout records, generated by admin per billing period.

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `nurseId` | String | FK → Nurse |
| `amount` | Float | Total owed (visits × payRatePerVisit) |
| `visits` | Int | Number of completed visits in the period |
| `period` | String | e.g. `"2026-05"` |
| `status` | String | `pending` → `approved` → `paid` |
| `paidAt` | DateTime? | When admin marked as paid |

---

### `Notification`

In-app notifications for all user roles.

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `userId` | String | FK → User (recipient) |
| `type` | String | `NEW_JOB` · `JOB_ASSIGNED` · `JOB_UPDATED` · `VISIT_COMPLETED` · `VISIT_CANCELLED` · `NURSE_ON_WAY` · `NURSE_ARRIVED` · `announcement` |
| `title` | String | Short title |
| `message` | String | Full message body |
| `relatedId` | String? | ID of the related visit or other entity |
| `read` | Boolean | Default false |

---

### `SystemSettings`

Key-value store for admin-configurable settings (pricing, trial length, etc.).

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `key` | String | Unique setting key |
| `value` | String | JSON string — e.g. `{"basicPrice":30,"standardPrice":50,...}` |

Currently one record holds all pricing. Accessed via `GET /settings/public` (no auth) for the pricing page.

---

### `PasswordReset`

Tokens for forgot-password flow.

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `userId` | String | FK → User |
| `token` | String | Unique random token (sent in reset email) |
| `expiresAt` | DateTime | 1 hour from creation |
| `used` | Boolean | Prevents reuse after first use |

---

### `ChatLog`

Stores AI assistant Q&A for RAG (retrieval-augmented generation).

| Column | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `context` | String | `landing` · `client` · `nurse` · `admin` |
| `question` | String | User question (max 1000 chars stored) |
| `answer` | String | Vona's answer (max 2000 chars stored) |
| `helpful` | Boolean? | `null` = unrated, `true` = thumbs up, `false` = thumbs down |

Logs where `helpful = false` are excluded from future RAG context to prevent bad answers from propagating.

---

## Entity Relationships

```
User ─────┬── Nurse ──────┬── Visit[] (as assigned nurse)
          │               ├── Review[]
          │               ├── Payout[]
          │               └── VisitApplication[]
          │
          ├── Subscription (1:1)
          ├── Relative[] ── Visit[] (as patient)
          ├── Payment[]
          └── Notification[]

Visit ────┬── Review (1:1, optional)
          └── VisitApplication[]
```

---

## Migrations

Migrations are tracked in `backend/prisma/migrations/`. Every schema change goes through:

```bash
# Development
npx prisma migrate dev --name describe-what-changed

# Production (run automatically on deploy via start script)
npx prisma migrate deploy
```

**Never** edit migration files manually. Always change `schema.prisma` and run `migrate dev`.
