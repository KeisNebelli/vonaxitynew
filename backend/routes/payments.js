const router = require('express').Router();
const prisma = require('../lib/db');
const { authMiddleware, requireRole } = require('../middleware/auth');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2023-10-16' });
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://vonaxity.com';

const PLANS = {
  basic:    { name:'Basic',    price: 3000, visits: 1, priceId: process.env.STRIPE_PRICE_BASIC },
  standard: { name:'Standard', price: 5000, visits: 2, priceId: process.env.STRIPE_PRICE_STANDARD },
  premium:  { name:'Premium',  price:12000, visits: 4, priceId: process.env.STRIPE_PRICE_PREMIUM },
};

// POST /payments/create-checkout — create Stripe checkout session
router.post('/create-checkout', ...requireRole('CLIENT'), async (req, res) => {
  try {
    const { plan } = req.body;
    if (!PLANS[plan]) return res.status(400).json({ error: 'Invalid plan' });
    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: 'Stripe not configured' });

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, name: user.name, metadata: { userId: user.id } });
      customerId = customer.id;
      await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId: customerId } });
    }

    const planData = PLANS[plan];
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: planData.priceId, quantity: 1 }],
      success_url: `${FRONTEND_URL}/{LANG}/dashboard?payment=success&plan=${plan}`.replace('{LANG}', req.body.lang || 'en'),
      cancel_url: `${FRONTEND_URL}/{LANG}/dashboard?payment=cancelled`.replace('{LANG}', req.body.lang || 'en'),
      metadata: { userId: user.id, plan },
      subscription_data: { metadata: { userId: user.id, plan } },
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error('Create checkout error:', err);
    res.status(500).json({ error: err.message || 'Failed to create checkout session' });
  }
});

// POST /payments/create-portal — billing portal for managing subscription
router.post('/create-portal', ...requireRole('CLIENT'), async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: 'Stripe not configured' });
    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });
    if (!user?.stripeCustomerId) return res.status(400).json({ error: 'No billing account found' });
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${FRONTEND_URL}/en/dashboard`,  // portal always returns to en (Stripe limitation)
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Create portal error:', err);
    res.status(500).json({ error: 'Failed to open billing portal' });
  }
});

/**
 * POST /payments/webhook — Stripe webhook handler
 *
 * IMPORTANT: This route receives raw (unparsed) request body.
 * The express.raw() middleware is applied BEFORE express.json() in server.js.
 * Do NOT move this route or add JSON parsing before it — Stripe signature
 * verification will fail if the body is parsed.
 *
 * Webhook secret (STRIPE_WEBHOOK_SECRET) is set in Stripe Dashboard → Developers → Webhooks.
 * Each endpoint URL has its own unique signing secret.
 *
 * Events handled:
 *   checkout.session.completed  → activate subscription after successful payment
 *   invoice.payment_succeeded   → reset monthly visit count at billing period renewal
 *   customer.subscription.deleted → cancel subscription if user cancels via Stripe portal
 *   customer.subscription.updated → sync status changes (e.g. PAST_DUE)
 *
 * userId and plan are passed via Stripe metadata, set when creating the checkout session.
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody || req.body, sig, WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).json({ error: `Webhook error: ${err.message}` });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const { userId, plan } = session.metadata || {};
        if (!userId || !plan) break;
        const planData = PLANS[plan];
        if (!planData) break;
        // Activate or create subscription — reset visitsUsed so new billing cycle starts fresh
        const existing = await prisma.subscription.findUnique({ where: { userId } });
        if (existing) {
          await prisma.subscription.update({ where: { userId }, data: { plan, status: 'ACTIVE', visitsPerMonth: planData.visits, visitsUsed: 0, stripeSubId: session.subscription, stripeCustomerId: session.customer } });
        } else {
          await prisma.subscription.create({ data: { userId, plan, status: 'ACTIVE', visitsPerMonth: planData.visits, visitsUsed: 0, stripeSubId: session.subscription, stripeCustomerId: session.customer } });
        }
        await prisma.user.update({ where: { id: userId }, data: { status: 'ACTIVE', stripeCustomerId: session.customer } });

        break;
      }
      case 'invoice.payment_succeeded': {
        // Fires at every successful billing cycle renewal
        // Reset the monthly visit counter so the client can book again
        const invoice = event.data.object;
        const sub = await stripe.subscriptions.retrieve(invoice.subscription);
        const userId = sub.metadata?.userId;
        if (!userId) break;
        await prisma.subscription.updateMany({ where: { stripeSubId: invoice.subscription }, data: { visitsUsed: 0, status: 'ACTIVE' } });

        break;
      }
      case 'customer.subscription.deleted': {
        // Fires when subscription is cancelled (user cancels via Stripe portal or admin cancels)
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        if (!userId) break;
        await prisma.subscription.updateMany({ where: { stripeSubId: sub.id }, data: { status: 'CANCELLED', cancelledAt: new Date() } });
        await prisma.user.update({ where: { id: userId }, data: { status: 'SUSPENDED' } });

        break;
      }
      case 'customer.subscription.updated': {
        // Fires on plan changes, payment failures (past_due), etc.
        const sub = event.data.object;
        const userId = sub.metadata?.userId;
        if (!userId) break;
        const status = sub.status === 'active' ? 'ACTIVE' : sub.status === 'past_due' ? 'PAST_DUE' : sub.status;
        await prisma.subscription.updateMany({ where: { stripeSubId: sub.id }, data: { status: status.toUpperCase() } });
        break;
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// GET /payments — admin gets all payments
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
      // Table might not exist yet — return empty list gracefully
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
        stripeId: p.stripeId,
      }))
    });
  } catch (err) {
    console.error('Get payments error:', err);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

module.exports = router;
