-- Migration: stripe_to_paypal
-- Renames Stripe-specific columns to PayPal equivalents.
-- Safe to run: only renames columns, no data loss.

-- Subscription table: stripeSubId → paypalSubId, drop stripeCustomerId
ALTER TABLE "Subscription" RENAME COLUMN "stripeSubId" TO "paypalSubId";
ALTER TABLE "Subscription" DROP COLUMN IF EXISTS "stripeCustomerId";

-- Payment table: stripeId → paypalId
ALTER TABLE "Payment" RENAME COLUMN "stripeId" TO "paypalId";

-- User table: drop stripeCustomerId if it was added
ALTER TABLE "User" DROP COLUMN IF EXISTS "stripeCustomerId";
