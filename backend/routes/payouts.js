const router = require('express').Router();
const prisma = require('../lib/db');
const { requireRole } = require('../middleware/auth');

// GET /payouts — admin lists all payouts
router.get('/', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const payouts = await prisma.payout.findMany({
      include: {
        nurse: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    const normalized = payouts.map(p => ({
      id: p.id,
      nurseId: p.nurseId,
      nurseName: p.nurse?.user?.name || 'Unknown',
      nurseEmail: p.nurse?.user?.email || '',
      paypalEmail: p.nurse?.paypalEmail || null,
      amount: p.amount,
      visits: p.visits,
      period: p.period,
      status: p.status,
      paidAt: p.paidAt,
      createdAt: p.createdAt,
    }));
    res.json({ payouts: normalized });
  } catch (err) {
    console.error('Get payouts error:', err);
    res.status(500).json({ error: 'Failed to fetch payouts' });
  }
});

// POST /payouts/generate — admin generates pending payouts for all approved nurses
router.post('/generate', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const { period } = req.body; // e.g. "2025-01"
    if (!period) return res.status(400).json({ error: 'period is required (e.g. "2025-01")' });

    // Get all approved nurses with earnings > 0
    const nurses = await prisma.nurse.findMany({
      where: { status: 'APPROVED', totalEarnings: { gt: 0 } },
      include: { user: { select: { name: true, email: true } } },
    });

    const created = [];
    for (const nurse of nurses) {
      // Check if payout already exists for this period
      const existing = await prisma.payout.findFirst({
        where: { nurseId: nurse.id, period },
      });
      if (existing) continue;

      // Count completed visits for this period
      const [year, month] = period.split('-').map(Number);
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 1);
      const completedVisits = await prisma.visit.count({
        where: {
          nurseId: nurse.id,
          status: 'COMPLETED',
          completedAt: { gte: start, lt: end },
        },
      });
      if (completedVisits === 0) continue;

      const amount = completedVisits * nurse.payRatePerVisit;
      const payout = await prisma.payout.create({
        data: {
          nurseId: nurse.id,
          amount,
          visits: completedVisits,
          period,
          status: 'pending',
        },
      });
      created.push({ nurseName: nurse.user?.name, amount, visits: completedVisits });
    }

    console.log(`[ADMIN] Generated ${created.length} payouts for period ${period}`);
    res.json({ success: true, generated: created.length, payouts: created });
  } catch (err) {
    console.error('Generate payouts error:', err);
    res.status(500).json({ error: 'Failed to generate payouts' });
  }
});

// PUT /payouts/:id/approve — admin approves a payout
router.put('/:id/approve', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const payout = await prisma.payout.update({
      where: { id: req.params.id },
      data: { status: 'approved' },
    });
    console.log(`[ADMIN] Approved payout ${req.params.id}`);
    res.json({ success: true, payout });
  } catch (err) {
    res.status(500).json({ error: 'Failed to approve payout' });
  }
});

// PUT /payouts/:id/pay — admin marks payout as paid
router.put('/:id/pay', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const payout = await prisma.payout.findUnique({ where: { id: req.params.id } });
    if (!payout) return res.status(404).json({ error: 'Payout not found' });
    if (payout.status === 'paid') return res.status(400).json({ error: 'Payout already marked as paid' });

    const updated = await prisma.payout.update({
      where: { id: req.params.id },
      data: { status: 'paid', paidAt: new Date() },
    });
    console.log(`[ADMIN] Marked payout ${req.params.id} as paid`);
    res.json({ success: true, payout: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark payout as paid' });
  }
});

// PUT /payouts/:id/reject — admin rejects a payout
router.put('/:id/reject', ...requireRole('ADMIN'), async (req, res) => {
  try {
    const updated = await prisma.payout.update({
      where: { id: req.params.id },
      data: { status: 'rejected' },
    });
    res.json({ success: true, payout: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reject payout' });
  }
});

module.exports = router;
