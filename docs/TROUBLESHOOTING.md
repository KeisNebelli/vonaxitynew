# Troubleshooting

Common issues and how to fix them.

---

## Local Development

### "Cannot connect to database" / Prisma errors

**Symptom**: Backend crashes on start with a database connection error.

**Fix**:
1. Make sure PostgreSQL is running: `brew services start postgresql@14` (Mac) or check Windows Services
2. Verify `DATABASE_URL` in `backend/.env` has the correct password
3. Confirm the database exists: `psql -U postgres -c "\l"` — you should see `vonaxity`
4. If database doesn't exist: `psql -U postgres -c "CREATE DATABASE vonaxity;"`

---

### "Cannot find module '@prisma/client'"

**Symptom**: Backend fails to start with module not found error.

**Fix**:
```bash
cd backend
npx prisma generate
```

This generates the Prisma client from the schema. Run this after: cloning the repo, pulling changes that include schema changes, or after `npm install`.

---

### Login not working / "Invalid credentials"

**Symptom**: Login fails even with correct test credentials.

**Fix**:
1. Make sure you ran `npm run db:seed` in `backend/` — this creates the test accounts
2. Make sure the backend is running on port 4000
3. Check `FRONTEND_URL` in `backend/.env` matches what's in the browser URL bar
4. If you previously seeded and changed the database, re-run: `npm run db:seed`

---

### CORS errors in browser console

**Symptom**: `CORS policy: No 'Access-Control-Allow-Origin'` in browser dev tools.

**Fix**:
1. Confirm `FRONTEND_URL=http://localhost:3000` in `backend/.env`
2. Restart the backend after changing `.env`
3. If using a custom port, add it to the `allowedOrigins` array in `backend/server.js`

---

### "Port 4000 already in use"

**Fix**:
```bash
# Mac/Linux
lsof -ti:4000 | xargs kill

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

---

### Frontend shows "Unable to connect" toast

**Symptom**: Dashboard or login page shows a connection error.

**Cause**: The frontend can't reach the backend.

**Fix**:
1. Make sure backend is running: `http://localhost:4000/health`
2. Check `NEXT_PUBLIC_API_URL=http://localhost:4000` in `frontend/.env.local`
3. Restart the frontend dev server after changing `.env.local`

---

### 401 Unauthorized on all API calls

**Symptom**: Every API call returns 401 after logging in.

**Causes**:
- JWT token has expired (default: 7 days)
- `JWT_SECRET` was changed while user was logged in
- Token wasn't stored correctly

**Fix**: Log out and log back in. The new token will be stored correctly.

---

### Prisma migration errors

**Symptom**: `npx prisma migrate dev` fails.

**Common causes and fixes**:

1. **"There is a failed migration"** → The previous migration failed halfway:
   ```bash
   npx prisma migrate resolve --rolled-back <migration-name>
   ```

2. **"Column already exists"** → Schema and database are out of sync:
   ```bash
   npx prisma db push   # force-sync schema to DB (dev only — loses data)
   ```

3. **"Cannot drop column"** → PostgreSQL requires explicit column drop migrations:
   - Never use `prisma db push` in production
   - Write the migration manually or use `prisma migrate dev`

---

### File uploads fail (Cloudinary)

**Symptom**: Nurse document/photo upload returns an error.

**Fix**:
1. Check that all three Cloudinary env vars are set: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
2. Restart the backend after adding env vars
3. Check Cloudinary dashboard for usage limits (free tier: 25GB)

---

## Production Issues

### Backend not responding / Railway deployment failed

1. Check Railway dashboard → Deployments → view build logs
2. Common cause: missing env variable → check all required vars are set in Railway
3. Check `prisma migrate deploy` step — if schema migration fails, the server won't start
4. Health check: `curl https://vonaxitynew-production.up.railway.app/health`

---

### "Stripe not configured" error

**Symptom**: Users can't subscribe / checkout fails.

**Fix**: Set `STRIPE_SECRET_KEY` in Railway environment variables. Ensure the key starts with `sk_live_` for production.

---

### Stripe webhook not triggering subscription updates

**Symptom**: User completes payment on Stripe but their account doesn't upgrade.

**Causes**:
1. `STRIPE_WEBHOOK_SECRET` is wrong or missing in Railway
2. Webhook endpoint is not registered in Stripe Dashboard
3. The backend is returning non-200 responses to Stripe (Stripe retries up to 3 days)

**Fix**:
1. Stripe Dashboard → Developers → Webhooks → check your endpoint is listed and has status "Enabled"
2. Check "Recent deliveries" for errors
3. Verify `STRIPE_WEBHOOK_SECRET` matches the secret shown on the webhook endpoint page
4. Re-register the webhook if needed: `https://vonaxitynew-production.up.railway.app/payments/webhook`

---

### Emails not sending

**Symptom**: Password reset emails or visit reports don't arrive.

**Fix**:
1. Verify `RESEND_API_KEY` is set in Railway
2. Verify `EMAIL_FROM` domain is verified in Resend (Resend Dashboard → Domains)
3. Check spam folder — some email clients filter automated emails
4. Check Resend Dashboard → Logs for delivery status

---

### SMS not sending

**Symptom**: Visit reminder SMS not received.

**Fix**:
1. Verify `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` in Railway
2. Check Twilio Console → Monitor → Logs for errors
3. Albanian phone numbers must be in E.164 format: `+355 XX XXX XXXX`
4. Twilio may require a specific sender ID for Albanian numbers — check Twilio's country regulations

---

### AI assistant returns "temporarily unavailable"

**Symptom**: Vona chat shows an error message.

**Fix**:
1. Verify `ANTHROPIC_API_KEY` in Railway
2. Check Anthropic Console → API Keys — the key may be expired or rate-limited
3. The AI rate limiter is 20 requests / 15 min per IP — this resets automatically
4. Check Anthropic status: https://status.anthropic.com

---

### Vercel deployment failed

1. Check Vercel dashboard → Deployments → view build logs
2. Common cause: missing `NEXT_PUBLIC_API_URL` env var
3. Common cause: TypeScript/ESLint errors in new code — run `npm run build` locally first to catch them
4. If `next build` succeeds locally but fails on Vercel, check Node.js version compatibility (Vercel default: Node 18)

---

### Calendar not showing visit chips

**Symptom**: Calendar shows empty cells even when visits exist.

**Cause**: CSS Grid column width issue — cells need `overflow: hidden` and `minWidth: 0`.

**This is already fixed** in the current codebase. If it reappears after editing calendar components, ensure every grid cell `<div>` has `style={{ minWidth:0, overflow:'hidden' }}`.

---

## Database

### Viewing the database

```bash
cd backend
npx prisma studio   # Opens http://localhost:5555 — GUI for all tables
```

Or connect with TablePlus/pgAdmin/DBeaver using your `DATABASE_URL`.

### Resetting local database (development only)

```bash
cd backend
npx prisma migrate reset   # Drops all tables, re-runs all migrations, re-seeds
```

**Never run this on production.**

### Finding orphaned records

If visits have a `relativeId` pointing to a deleted relative (shouldn't happen — foreign keys prevent this), check:
```sql
SELECT * FROM "Visit" WHERE "relativeId" NOT IN (SELECT id FROM "Relative");
```

---

## Common Code Questions

### How do I add a new API endpoint?

1. Find the appropriate route file in `backend/routes/`
2. Add a new `router.get/post/put/delete` handler
3. Use `authMiddleware` for authenticated routes, `requireRole('ADMIN')` for admin-only
4. Add the corresponding `api.yourFunction()` call in `frontend/lib/api.js`

### How do I add a new translation string?

1. Open `frontend/translations/index.js`
2. Add under `en:` (English)
3. Add the Albanian translation under `sq:`
4. Use in component: `t(lang, 'section.key')`

### How do I add a new nurse status?

1. Update the valid values comment in `backend/prisma/schema.prisma`
2. Update the `statusMap` objects in:
   - `frontend/app/[lang]/nurse/page.jsx` (`NurseVisitCard`)
   - `frontend/components/map/VisitLocationCard.jsx` (`STATUS_STYLES`)
   - `frontend/app/[lang]/admin/page.jsx`
3. Update the status timeline in `NurseVisitCard` if it's a progression step

### Why are `specialties`, `availability`, `languages` stored as JSON strings?

The database uses `String` fields for these arrays for cross-database compatibility (the schema was originally designed to work with SQLite as well as Postgres). Parse them with `JSON.parse()` when reading, stringify with `JSON.stringify()` when writing.
