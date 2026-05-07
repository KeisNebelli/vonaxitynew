# Feature Map

Every product feature and where its code lives.

---

## Public Website (Marketing)

| Feature | URL | File |
|---|---|---|
| Homepage / landing | `/[lang]` | `frontend/app/[lang]/page.jsx` |
| Pricing page | `/[lang]/pricing` | `frontend/app/[lang]/pricing/page.jsx` |
| Services page | `/[lang]/services` | `frontend/app/[lang]/services/page.jsx` |
| How it works | `/[lang]/how-it-works` | `frontend/app/[lang]/how-it-works/page.jsx` |
| About page | `/[lang]/about` | `frontend/app/[lang]/about/page.jsx` |
| Contact form | `/[lang]/contact` | `frontend/app/[lang]/contact/page.jsx` |
| FAQ | `/[lang]/faq` | `frontend/app/[lang]/faq/page.jsx` |
| Nurse directory (public) | `/[lang]/nurses` | `frontend/app/[lang]/nurses/page.jsx` |
| Individual nurse profile | `/[lang]/nurses/[id]` | `frontend/app/[lang]/nurses/[id]/page.jsx` |
| Terms of Service | `/[lang]/terms` | `frontend/app/[lang]/terms/page.jsx` |
| Privacy Policy | `/[lang]/privacy` | `frontend/app/[lang]/privacy/page.jsx` |
| Medical disclaimer | `/[lang]/disclaimer` | `frontend/app/[lang]/disclaimer/page.jsx` |
| Navigation bar | All pages | `frontend/components/layout/Nav.jsx` |
| Footer | All pages | `frontend/components/layout/Footer.jsx` |
| Cookie consent banner | All pages | `frontend/components/CookieBanner.jsx` |
| AI chat (Vona — landing) | Homepage | `frontend/components/chat/LandingChat.jsx` |
| Language toggle (EN/SQ) | All pages | `frontend/components/LangToggle.jsx` |

---

## Auth

| Feature | File |
|---|---|
| Client registration (3-step) | `frontend/app/[lang]/signup/page.jsx` |
| Nurse registration | `frontend/app/[lang]/nurse-signup/page.jsx` |
| Login (all roles) | `frontend/app/[lang]/login/page.jsx` |
| Forgot password | `frontend/app/[lang]/forgot-password/page.jsx` |
| Reset password | `frontend/app/[lang]/reset-password/page.jsx` |
| JWT middleware (backend) | `backend/middleware/auth.js` |
| Route guards + lang redirect | `frontend/middleware.js` |
| React auth context | `frontend/context/AuthContext.jsx` |
| Backend auth routes | `backend/routes/auth.js` |

Auth token is stored in:
- `localStorage` key: `vonaxity-token` (for API calls)
- Cookie: `vonaxity-token` + `vonaxity-role` (for Next.js middleware route guards)

---

## Client Dashboard

All client dashboard code is in `frontend/app/[lang]/dashboard/page.jsx` (one large file with multiple internal components).

| Feature | Component (inside dashboard/page.jsx) |
|---|---|
| Dashboard overview + stats | `Overview` |
| Mini calendar with visit chips | `ClientCalendar` |
| Book a visit form | `BookVisit` |
| My Visits list | `Visits` |
| Visit detail modal | `VisitDetailModal` |
| Review / rate a nurse | Inside `Visits` component |
| Edit a visit | `EditVisit` |
| Delete a visit | `DeleteConfirm` |
| Select a nurse (applicants) | `NurseApplicants` |
| View applicants | Inside `Visits` |
| Health records + vitals charts | `HealthProgress` → `frontend/app/[lang]/dashboard/health.jsx` |
| Find nurses (browse directory) | `FindNurses` |
| Subscription management | `Subscription` |
| Settings (account, relatives) | `Settings` → `frontend/app/[lang]/dashboard/settings.jsx` |
| AI chat (Vona — client) | `DashboardChat` → `frontend/components/chat/DashboardChat.jsx` |
| Notification bell | `NotificationBell` |
| Print/download PDF report | `printReport()` inside `VisitDetailModal` |

---

## Nurse Dashboard

All nurse dashboard code is in `frontend/app/[lang]/nurse/page.jsx`.

| Feature | Component |
|---|---|
| Dashboard overview + stats | `Dashboard` |
| Mini calendar with visit chips | `DashboardCalendar` |
| Browse open jobs | `Jobs` |
| My Visits list + visit cards | `Visits` + `NurseVisitCard` |
| Visit status timeline | Inside `NurseVisitCard` |
| Map + directions | `VisitLocationCard` → `frontend/components/map/VisitLocationCard.jsx` |
| Full calendar (monthly) | `NurseCalendar` |
| Complete visit wizard (3-step) | `CompleteVisit` |
| Job history + search | `JobHistory` |
| Patient health records | `HealthProgress` (reused from client) |
| Nurse profile editing | `Profile` |
| PDF print report | Inside `NurseVisitCard` (completed visits) |
| AI chat (Vona — nurse) | `NurseChat` → `frontend/components/chat/NurseChat.jsx` |
| Notification bell | `NotificationBell` |
| Navigation sidebar | `NurseSidebar` |

---

## Admin CRM

All admin code is in `frontend/app/[lang]/admin/page.jsx`.

| Feature | Description |
|---|---|
| Overview / analytics | Total clients, nurses, visits, revenue |
| Nurse management | List, approve, reject, suspend nurses; view uploaded documents |
| Client management | List clients, view subscription status |
| Visit management | View all visits, assign nurses, update status |
| Payments | View all PayPal payment records |
| Payouts | Generate nurse payouts by period, approve, mark paid |
| Platform settings | Adjust pricing (Basic/Standard/Premium), trial days, pay rate |
| Announcements | Send notifications to all users |
| AI CRM assistant (Vona) | Summarizes CRM data, answers admin questions |

---

## Map & Navigation

| Feature | File |
|---|---|
| Embedded map (patient location) | `frontend/components/map/MapComponent.jsx` |
| Navigation buttons (Google Maps / Waze / Apple Maps) | `frontend/components/map/NavigationButton.jsx` |
| Full visit card with map | `frontend/components/map/VisitLocationCard.jsx` |
| Nurse geolocation hook | `frontend/hooks/useNurseLocation.js` |

---

## Payments & Subscriptions

| Feature | Backend File | Frontend File |
|---|---|---|
| Create PayPal subscription | `backend/routes/payments.js` | `api.createPayPalSubscription()` |
| Capture subscription after redirect | `backend/routes/payments.js` | `api.capturePayPalSubscription()` |
| Cancel active subscription | `backend/routes/payments.js` | `api.cancelPayPalSubscription()` |
| Handle PayPal webhook | `backend/routes/payments.js` | N/A (server-side only) |
| Trial expiry sweep | `backend/server.js` → `expireTrials()` | N/A |
| Display subscription status | N/A | `Subscription` component in dashboard |

---

## Notifications

| Feature | File |
|---|---|
| Create notification (backend) | `backend/lib/notifications.js` |
| Send to user | `backend/routes/other.js` → `/notifications/send` |
| Get my notifications | `backend/routes/other.js` → `GET /notifications` |
| Mark read | `backend/routes/other.js` → `PUT /notifications/:id/read` |
| Notification bell UI | `NotificationBell` component in both dashboards |

---

## AI Assistant (Vona)

| Feature | File |
|---|---|
| AI proxy endpoint | `backend/server.js` → `POST /ai/chat` |
| Feedback endpoint | `backend/server.js` → `POST /ai/feedback` |
| RAG (past Q&A retrieval) | `findRelevantPastAnswers()` in `server.js` |
| System prompts (all 4 contexts) | `SYSTEM_BASE` object in `server.js` |
| Live pricing in prompts | `getLivePricing()` + `buildPricingBlock()` in `server.js` |
| Landing chat widget | `frontend/components/chat/LandingChat.jsx` |
| Client dashboard chat | `frontend/components/chat/DashboardChat.jsx` |
| Nurse dashboard chat | `frontend/components/chat/NurseChat.jsx` |

---

## File Uploads

| Feature | File |
|---|---|
| Upload endpoint | `backend/routes/uploads.js` |
| Cloudinary integration | `backend/routes/uploads.js` (multer + cloudinary SDK) |
| Nurse license upload | `api.uploadNurseDoc()` in `frontend/lib/api.js` |

---

## Email

| Feature | File |
|---|---|
| Email helpers | `backend/lib/email.js` |
| Password reset email | Called from `backend/routes/auth.js` |
| Visit report email | Called from `backend/routes/visits.js` on completion |

---

## Translations (i18n)

| Feature | File |
|---|---|
| All bilingual strings | `frontend/translations/index.js` |
| Translation helper | `t(lang, 'key.path')` — exported from the same file |
| Language detection hook | `frontend/hooks/useLang.js` |
| Language redirect (middleware) | `frontend/middleware.js` |

---

## Shared UI Components

| Component | File | Used In |
|---|---|---|
| Toast notifications | `frontend/components/ui/Toast.jsx` | Nurse dashboard |
| Nurse avatar | `frontend/components/ui/NurseAvatar.jsx` | Nurse directory |
| Albania map SVG | `frontend/components/visuals/AlbaniaMap.jsx` | Homepage |
| Hero illustration | `frontend/components/visuals/HeroIllustration.jsx` | Homepage |
| Step animations | `frontend/components/visuals/StepAnimations.jsx` | How it works |
| Live activity ticker | `frontend/components/LiveActivity.jsx` | Homepage |
| Scroll reveal animation | `frontend/components/ScrollReveal.jsx` | Homepage |
| Organic background | `frontend/components/OrganicBackground.jsx` | Homepage |

---

## Design System

All design tokens (colors, fonts, spacing) are defined inline within each component as a local `C` object. A shared reference exists at `frontend/lib/design.js`. There is no external CSS framework.

Color palette reference (from `frontend/lib/design.js` and component-level `C` objects):

```js
primary:       '#2563EB'   // Blue
primaryLight:  '#EFF6FF'
secondary:     '#059669'   // Green
secondaryLight:'#ECFDF5'
warning:       '#D97706'   // Amber
error:         '#DC2626'   // Red
purple:        '#7C3AED'
bg:            '#FAFAF9'   // Page background
bgWhite:       '#FFFFFF'
textPrimary:   '#111827'
textSecondary: '#6B7280'
textTertiary:  '#9CA3AF'
border:        '#E5E7EB'
```

Font: `'DM Sans', 'Inter', system-ui, sans-serif` (loaded from Google Fonts via `frontend/app/layout.jsx`)
