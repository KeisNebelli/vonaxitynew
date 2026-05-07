# API Routes

Base URL (production): `https://vonaxitynew-production.up.railway.app`
Base URL (local): `http://localhost:4000`

All authenticated routes require the header:
```
Authorization: Bearer <jwt-token>
```

Auth roles: `CLIENT` · `NURSE` · `ADMIN`

---

## Health

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/health` | None | Returns `{"status":"ok"}` — used for uptime checks |

---

## Auth — `/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | None | Register a new client account |
| POST | `/auth/register-nurse` | None | Register a new nurse account |
| POST | `/auth/login` | None | Login — returns JWT token |
| POST | `/auth/logout` | None | Clears session cookie |
| GET | `/auth/me` | Any | Get current logged-in user profile |
| POST | `/auth/forgot-password` | None | Send password reset email |
| POST | `/auth/reset-password` | None | Reset password with token from email |

### POST `/auth/register`
```json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "securepass123",
  "phone": "+44 7700 000000",
  "country": "United Kingdom",
  "language": "en"
}
```
Returns: `{ token, user: { id, name, email, role, status } }`

### POST `/auth/login`
```json
{ "email": "john@example.com", "password": "securepass123" }
```
Returns: `{ token, user: { id, name, email, role, status } }`

---

## Visits — `/visits`

Rate limited: 30 requests / 15 min per IP.

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/visits` | Any | Get visits for the current user (role-aware) |
| POST | `/visits` | CLIENT, ADMIN | Create a new visit booking |
| GET | `/visits/open` | NURSE | List open (UNASSIGNED) visits in nurse's city |
| POST | `/visits/:id/apply` | NURSE | Apply to an open visit |
| GET | `/visits/:id/applicants` | CLIENT, ADMIN | Get nurse applicants for a visit |
| POST | `/visits/:id/select/:nurseId` | CLIENT, ADMIN | Assign a nurse to a visit |
| PUT | `/visits/:id/client` | CLIENT | Edit visit details (date, service, notes) |
| DELETE | `/visits/:id` | CLIENT, ADMIN | Delete a visit (only UNASSIGNED/PENDING) |
| PUT | `/visits/:id` | ADMIN | Admin edit any visit |
| PUT | `/visits/:id/status` | NURSE | Update visit status (ON_THE_WAY, ARRIVED, etc.) |
| POST | `/visits/:id/complete` | NURSE | Submit completion report with vitals + notes |
| GET | `/visits/vitals/:relativeId` | Any | Get vitals history for a specific relative |
| POST | `/visits/:id/review` | CLIENT | Submit a rating and comment for a completed visit |

### POST `/visits` — Create Booking
```json
{
  "relativeId": "clx...",
  "serviceType": "Blood Pressure Check",
  "scheduledAt": "2026-06-15T10:00:00.000Z",
  "notes": "Patient takes metformin daily"
}
```
Returns: `{ visit: { id, workOrderNumber, status, ... } }`

### POST `/visits/:id/complete` — Complete Visit
```json
{
  "bp": "120/80",
  "hr": 72,
  "glucose": 5.4,
  "temperature": 36.8,
  "oxygenSat": 98,
  "weight": 68,
  "conditionFlag": "stable",
  "nurseNotes": "[Assessment]\nPatient in good condition...\n\n[Condition] STABLE"
}
```

### PUT `/visits/:id/status` — Update Status
```json
{ "status": "ON_THE_WAY" }
```
Valid transitions: `ACCEPTED` → `ON_THE_WAY` → `ARRIVED` → `IN_PROGRESS` → `COMPLETED`

---

## Nurses — `/nurses`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/nurses` | ADMIN | List all nurses with full profiles |
| GET | `/nurses/me` | NURSE | Get own nurse profile |
| PUT | `/nurses/me/onboarding` | NURSE | Submit onboarding form (sets status to PENDING) |
| PUT | `/nurses/me/profile` | NURSE | Update profile fields |
| GET | `/nurses/public` | None | List approved nurses (public directory) |
| GET | `/nurses/public/:id` | None | Get single approved nurse profile |
| GET | `/nurses/:id` | ADMIN | Get any nurse by ID |
| PUT | `/nurses/:id` | ADMIN | Edit any nurse profile |
| PUT | `/nurses/:id/approve` | ADMIN | Approve a nurse application |
| PUT | `/nurses/:id/suspend` | ADMIN | Suspend a nurse |
| PUT | `/nurses/:id/reject` | ADMIN | Reject with a reason |
| PUT | `/nurses/:id/availability` | NURSE, ADMIN | Update availability days |

### PUT `/nurses/me/onboarding`
```json
{
  "city": "Tirana",
  "specialties": ["Blood Pressure", "Glucose Monitoring"],
  "availability": ["Monday", "Wednesday", "Friday"],
  "experience": "3-5 years",
  "languages": ["Albanian", "English"],
  "licenseNumber": "ON-12345",
  "bio": "Experienced nurse with 4 years in home care..."
}
```

### PUT `/nurses/:id/reject`
```json
{ "reason": "License could not be verified. Please resubmit." }
```

---

## Payments — `/payments`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/payments/create-checkout` | CLIENT | Create Stripe checkout session |
| POST | `/payments/create-portal` | CLIENT | Open Stripe billing portal |
| POST | `/payments/webhook` | None (Stripe sig) | Stripe webhook receiver |
| GET | `/payments` | ADMIN | List all payment records |

### POST `/payments/create-checkout`
```json
{ "plan": "standard", "lang": "en" }
```
Returns: `{ url: "https://checkout.stripe.com/...", sessionId: "cs_..." }`

### Webhook Events Handled
- `checkout.session.completed` → creates/updates Subscription, records Payment
- `customer.subscription.updated` → updates plan/status/dates
- `customer.subscription.deleted` → marks subscription CANCELLED
- `invoice.payment_failed` → marks subscription PAST_DUE

---

## Payouts — `/payouts`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/payouts` | ADMIN | List all payout records |
| POST | `/payouts/generate` | ADMIN | Generate payouts for a billing period |
| PUT | `/payouts/:id/approve` | ADMIN | Approve a payout |
| PUT | `/payouts/:id/pay` | ADMIN | Mark a payout as paid |
| PUT | `/payouts/:id/reject` | ADMIN | Reject a payout |

### POST `/payouts/generate`
```json
{ "period": "2026-05" }
```

---

## Users — `/users`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/users` | ADMIN | List all users |
| GET | `/users/:id` | ADMIN | Get user by ID |
| PUT | `/users/:id` | ADMIN | Edit user details |
| PUT | `/users/:id/status` | ADMIN | Change user status (ACTIVE/SUSPENDED) |
| GET | `/users/:id/relatives` | Any (own) | Get relatives for a user |
| POST | `/users/:id/relatives` | Any (own) | Add a relative |

---

## Uploads — `/uploads`

Rate limited: 20 uploads / 15 min per IP.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/uploads/nurse-doc` | NURSE | Upload license/diploma/photo to Cloudinary |

Request: `multipart/form-data` with fields `file` (binary) and `type` (`diploma` · `license` · `photo`).
Returns: `{ url: "https://res.cloudinary.com/..." }`

---

## Analytics — `/analytics`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/analytics` | ADMIN | Platform-wide stats (users, visits, revenue) |

---

## Notifications — `/notifications`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | Any | Get notifications for current user |
| POST | `/notifications/send` | ADMIN | Send notification to a user or all users |
| PUT | `/notifications/:id/read` | Any | Mark a notification as read |
| PUT | `/notifications/read-all` | Any | Mark all notifications as read |

---

## Settings — `/settings`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/settings/public` | None | Get current pricing (used by pricing page) |
| GET | `/settings` | ADMIN | Get all platform settings |
| PUT | `/settings` | ADMIN | Update settings (pricing, trial days, pay rate) |

### GET `/settings/public` Response
```json
{
  "basicPrice": 30,
  "standardPrice": 50,
  "premiumPrice": 120,
  "basicVisits": 1,
  "standardVisits": 2,
  "premiumVisits": 4
}
```

---

## Profile — `/profile`

| Method | Path | Auth | Description |
|---|---|---|---|
| PUT | `/profile` | Any | Update own profile (name, phone, language, etc.) |

---

## Contact — `/contact`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/contact` | None | Submit a contact form message (sends email via Resend) |

---

## AI Assistant — `/ai`

Rate limited: 20 requests / 15 min per IP.

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/ai/chat` | None | Send message to Vona AI assistant |
| POST | `/ai/feedback` | None | Submit thumbs up/down on an AI response |

### POST `/ai/chat`
```json
{
  "messages": [
    { "role": "user", "content": "What plans do you offer?" }
  ],
  "context": "landing",
  "userName": "John"
}
```
Returns: `{ content: "We offer three plans...", logId: "clx..." }`

Context values: `landing` · `client` · `dashboard` (alias for client) · `nurse` · `admin`

For `admin` context, pass `crmContext` (string of CRM data snapshot) to ground the AI in live data.

### POST `/ai/feedback`
```json
{ "logId": "clx...", "helpful": true }
```

---

## Admin Utilities

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/admin/cleanup-duplicates` | ADMIN | Remove duplicate work order numbers |
| POST | `/admin/test-reset` | ADMIN | Dev utility — reset test data |

---

## Error Responses

All errors follow this format:
```json
{ "error": "Human-readable error message" }
```

Common status codes:
- `400` — Bad request (missing/invalid fields)
- `401` — Unauthorized (no token or expired token)
- `403` — Forbidden (wrong role)
- `404` — Resource not found
- `429` — Rate limit exceeded
- `500` — Internal server error
