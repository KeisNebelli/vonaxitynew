/**
 * routes/payments.js — PayPal subscription management
 *
 * PayPal REST API v2 subscription flow:
 *   1. Client picks a plan → POST /payments/create-subscription
 *      → backend gets a PayPal access token, creates a subscription object,
 *        returns the PayPal approval URL
 *   2. Frontend redirects user to the PayPal approval URL
 *   3. User approves on PayPal → PayPal redirects back to return_url
 *      (?subscription_id=I-xxx is added by PayPal to the return URL)
 *   4. On return, frontend calls POST /payments/capture with the subscription_id
 *      → backend verifies the subscription is ACTIVE and updates the DB
 *   5. PayPal also fires webhook events (backup reliability):
 *      BILLING.SUBSCRIPTION.ACTIVATED  → activate subscription in DB
 *      PAYMENT.SALE.COMPLETED          → reset monthly visit counter on renewal
 *      BILLING.SUBSCRIPTION.CANCELLED  → cancel subscription
 *      BILLING.SUBSCRIPTION.PAYMENT.FAILED → mark PAST_DUE
 *
 * Required env vars:
 *   PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET — from PayPal Developer Dashboard
 *   PAYPAL_MODE — "sandbox" or "live" (default: "live")
 *   PAYPAL_PLAN_BASIC, PAYPAL_PLAN_STANDARD, PAYPAL_PLAN_PREMIUM — Plan IDs (P-xxx)
 *   PAYPAL_WEBHOOK_ID — from PayPal Dashboard → Webhooks (for signature verification)
 *   FRONTEND_URL — e.g. https://vonaxity.com
 *
 * No external SDK — uses native fetch() with PayPal REST API directly.
 */
const router = require('express').Router();
const prisma = require('../lib/db');
const { requireRole } = require('../middleware/auth');

const PAYPAL_BASE = process.env.PAYPAL_MODE === 'sandbox'
  ? 'https://api-m.sandbox.paypal.com'
  : 'https://api-m.paypal.com';

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://vonaxity.com';

const PLANS = {
  basic:    { name: 'Basic',    visits: 1, planId: process.env.PAYPAL_PLAN_BASIC },
  standard: { name: 'Standard', visits: 2, planId: process.env.PAYPAL_PLAN_STANDARD },
  premium:  { name: 'Premium',  visits: 4, planId: process.env.PAYPAL_PLAN_PREMIUM },
};

// ── Helper: get a short-lived PayPal OAuth2 access token ────────────────────
async function getPayPalToken() {
  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString('base64');
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || 'Failed to get PayPal token');
  return data.access_token;
}

// POST /payments/create-subscription
// Creates a PayPal subscription and returns the approval URL for redirect.
router.post('/create-subscription', ...requireRole('CLIENT'), async (req, res) => {
  try {
    const { plan, lang = 'en' } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ error: 'Invalid plan' });
    if (!process.env.PAYPAL_CLIENT_ID) return res.status(500).json({ error: 'PayPal not configured' });

    const planData = PLANS[plan];
    if (!planData.planId) {
      return res.status(500).json({ error: `PayPal plan ID not configured for "${plan}". Set PAYPAL_PLAN_${plan.toUpperCase()} in env.` });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = await getPayPalToken();

    // Split display name for PayPal subscriber object
    const nameParts = user.name.trim().split(' ');
    const givenName = nameParts[0];
    const surname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : nameParts[0];

    const subRes = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        // Idempotency key — prevents duplicate subscriptions on retry
        'PayPal-Request-Id': `vonaxity-${user.id}-${plan}-${Date.now()}`,
      },
      body: JSON.stringify({
        plan_id: planData.planId,
        subscriber: {
          name: { given_name: givenName, surname },
          email_address: user.email,
        },
        application_context: {
          brand_name: 'Vonaxity',
          locale: lang === 'sq' ? 'sq-AL' : 'en-US',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'SUBSCRIBE_NOW',
          // PayPal appends ?subscription_id=I-xxx to the return_url automatically
          return_url: `${FRONTEND_URL}/${lang}/dashboard?payment=success&plan=${plan}`,
          cancel_url: `${FRONTEND_URL}/${lang}/dashboard?payment=cancelled`,
        },
        // custom_id is included in all webhook events for this subscription
        custom_id: `${user.id}|${plan}`,
      }),
    });

    const subData = await subRes.json();
    if (!subRes.ok) {
      console.error('PayPal create subscription error:', subData);
      return res.status(500).json({ error: subData.message || 'Failed to create PayPal subscription' });
    }

    const approveLink = subData.links?.find(l => l.rel === 'approve');
    if (!approveLink) {
      console.error('No approval link in PayPal response:', subData);
      return res.status(500).json({ error: 'No approval URL returned by PayPal' });
    }

    res.json({ url: approveLink.href, subscriptionId: subData.id });
  } catch (err) {
    console.error('Create subscription error:', err);
    res.status(500).json({ error: err.message || 'Failed to create subscription' });
  }
});

// POST /payments/capture
// Called from the frontend after the user returns from PayPal approval.
// Belt-and-suspenders alongside the webhook — whichever arrives first wins.
router.post('/capture', ...requireRole('CLIENT'), async (req, res) => {
  try {
    const { subscriptionId, plan } = req.body;
    if (!subscriptionId || !PLANS[plan]) {
      return res.status(400).json({ error: 'Missing subscriptionId or invalid plan' });
    }

    // Verify the subscription is actually ACTIVE in PayPal before trusting it
    const token = await getPayPalToken();
    const checkRes = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions/${subscriptionId}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    const subData = await checkRes.json();
    if (!checkRes.ok || subData.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Subscription is not active yet — please wait a moment and reload.' });
    }

    const planData = PLANS[plan];
    const userId = req.user.userId;
    const existing = await prisma.subscription.findUnique({ where: { userId } });

    if (existing) {
      await prisma.subscription.update({
        where: { userId },
        data: { plan, status: 'ACTIVE', visitsPerMonth: planData.visits, visitsUsed: 0, paypalSubId: subscriptionId },
      });
    } else {
      await prisma.subscription.create({
        data: { userId, plan, status: 'ACTIVE', visitsPerMonth: planData.visits, visitsUsed: 0, paypalSubId: subscriptionId },
      });
    }
    await prisma.user.update({ where: { id: userId }, data: { status: 'ACTIVE' } });

    res.json({ success: true });
  } catch (err) {
    console.error('Capture subscription error:', err);
    res.status(500).json({ error: 'Failed to confirm subscription' });
  }
});

// POST /payments/cancel
// Client cancels their own subscription via in-app button.
router.post('/cancel', ...requireRole('CLIENT'), async (req, res) => {
  try {
    const sub = await prisma.subscription.findUnique({ where: { userId: req.user.userId } });
    if (!sub?.paypalSubId) return res.status(400).json({ error: 'No active PayPal subscription found' });

    const token = await getPayPalToken();
    const cancelRes = await fetch(`${PAYPAL_BASE}/v1/billing/subscriptions/${sub.paypalSubId}/cancel`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Cancelled by subscriber' }),
    });

    // 422 = already cancelled — treat as success
    if (!cancelRes.ok && cancelRes.status !== 422) {
      const errData = await cancelRes.json().catch(() => ({}));
      console.error('PayPal cancel error:', errData);
      return res.status(500).json({ error: errData.message || 'Failed to cancel subscription with PayPal' });
    }

    await prisma.subscription.update({
      where: { userId: req.user.userId },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });
    await prisma.user.update({ where: { id: req.user.userId }, data: { status: 'SUSPENDED' } });

    res.json({ success: true });
  } catch (err) {
    console.error('Cancel subscription error:', err);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// POST /payments/webhook — PayPal IPN/Webhook handler
// Events arrive as JSON — no raw body parsing needed (unlike Stripe).
// Register this URL in PayPal Dashboard → Webhooks.
router.post('/webhook', async (req, res) => {
  // ── Signature verification ──────────────────────────────────────────────────
  // Skip if PAYPAL_WEBHOOK_ID is not set (useful during local dev).
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (webhookId) {
    try {
      const token = await getPayPalToken();
      const verifyRes = await fetch(`${PAYPAL_BASE}/v1/notifications/verify-webhook-signature`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transmission_id:   req.headers['paypal-transmission-id'],
          transmission_time: req.headers['paypal-transmission-time'],
          cert_url:          req.headers['paypal-cert-url'],
          auth_algo:         req.headers['paypal-auth-algo'],
          transmission_sig:  req.headers['paypal-transmission-sig'],
          webhook_id:        webhookId,
          webhook_event:     req.body,
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.verification_status !== 'SUCCESS') {
        console.error('PayPal webhook verification failed:', verifyData);
        return res.status(400).json({ error: 'Webhook verification failed' });
      }
    } catch (verifyErr) {
      // Log but don't block — verification API can be flaky
      console.error('Webhook verification error (non-fatal):', verifyErr.message);
    }
  }

  const event = req.body;
  const eventType = event?.event_type;

  try {
    switch (eventType) {
      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        // Fires when subscriber approves and subscription becomes active
        const customId = event.resource?.custom_id || '';
        const [userId, plan] = customId.split('|');
        if (!userId || !PLANS[plan]) break;
        const planData = PLANS[plan];
        const subId = event.resource?.id;
        const existing = await prisma.subscription.findUnique({ where: { userId } });
        if (existing) {
          await prisma.subscription.update({
            where: { userId },
            data: { plan, status: 'ACTIVE', visitsPerMonth: planData.visits, visitsUsed: 0, paypalSubId: subId },
          });
        } else {
          await prisma.subscription.create({
            data: { userId, plan, status: 'ACTIVE', visitsPerMonth: planData.visits, visitsUsed: 0, paypalSubId: subId },
          });
        }
        await prisma.user.update({ where: { id: userId }, data: { status: 'ACTIVE' } });
        break;
      }

      case 'PAYMENT.SALE.COMPLETED': {
        // Fires on every successful renewal payment — reset monthly visit counter
        const subId = event.resource?.billing_agreement_id;
        if (!subId) break;
        await prisma.subscription.updateMany({
          where: { paypalSubId: subId },
          data: { visitsUsed: 0, status: 'ACTIVE' },
        });
        break;
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED':
      case 'BILLING.SUBSCRIPTION.EXPIRED': {
        const subId = event.resource?.id;
        if (!subId) break;
        const sub = await prisma.subscription.findFirst({ where: { paypalSubId: subId } });
        if (!sub) break;
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: 'CANCELLED', cancelledAt: new Date() },
        });
        await prisma.user.update({ where: { id: sub.userId }, data: { status: 'SUSPENDED' } });
        break;
      }

      case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED': {
        const subId = event.resource?.id;
        if (!subId) break;
        await prisma.subscription.updateMany({
          where: { paypalSubId: subId },
          data: { status: 'PAST_DUE' },
        });
        break;
      }

      default:
        // Unknown event type — log for visibility, don't error
        console.log(`PayPal webhook: unhandled event type "${eventType}"`);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// GET /payments — admin: list all recorded payments
router.get('/', ...requireRole('ADMIN'), async (req, res) => {
  try {
    let payments = [];
    try {
      payments = await prisma.payment.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' },
        take: 100,
      });
    } catch (dbErr) {
      console.warn('Payments query failed (table may not be migrated):', dbErr.message);
      return res.json({ payments: [] });
    }
    res.json({
      payments: payments.map(p => ({
        id: p.id,
        clientName: p.user?.name || 'Unknown',
        clientEmail: p.user?.email || '',
        plan: p.description || 'subscription',
        amount: p.amount,
        currency: p.currency || 'eur',
        status: p.status,
        date: p.createdAt ? new Date(p.createdAt).toLocaleDateString('en-GB') : 'N/A',
        paypalId: p.paypalId,
      })),
    });
  } catch (err) {
    console.error('Get payments error:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports = router;
