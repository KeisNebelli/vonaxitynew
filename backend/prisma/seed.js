// backend/prisma/seed.js  — safe to re-run anytime
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding test accounts…');
  const hash = async (pw) => bcrypt.hash(pw, 10);
  const FAR_FUTURE = new Date('2099-12-31');

  // ── Admin ──────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: { status: 'ACTIVE' },
    create: {
      name: 'Admin Vonaxity',
      email: 'admin@test.com',
      passwordHash: await hash('test123'),
      role: 'ADMIN',
      status: 'ACTIVE',
      country: 'Albania',
      city: 'Tirana',
    },
  });
  console.log('✅ Admin:', admin.email);

  // ── Nurse 1 (approved, full profile) ──────────────────────────────────────
  const nurseUser = await prisma.user.upsert({
    where: { email: 'nurse@test.com' },
    update: { status: 'ACTIVE' },
    create: {
      name: 'Elona Berberi',
      email: 'nurse@test.com',
      passwordHash: await hash('test123'),
      role: 'NURSE',
      status: 'ACTIVE',
      phone: '+355691234567',
      country: 'Albania',
      city: 'Tirana',
    },
  });
  const nurseProfile = await prisma.nurse.upsert({
    where: { userId: nurseUser.id },
    update: { status: 'APPROVED' },
    create: {
      userId: nurseUser.id,
      status: 'APPROVED',
      city: 'Tirana',
      rating: 4.8,
      totalVisits: 47,
      totalEarnings: 940,
      payRatePerVisit: 20,
      licenseNumber: 'ALB-NURSE-2024-001',
      experience: '6 years',
      bio: 'Specialised in cardiovascular monitoring and diabetic care. 6 years of home nursing experience across Tirana.',
      specialties: JSON.stringify(['Blood Pressure', 'Glucose Monitoring', 'Vitals']),
      languages: JSON.stringify(['Albanian', 'English']),
      availability: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Friday']),
    },
  });
  console.log('✅ Nurse:', nurseUser.email);

  // ── Nurse 2 (pending) ──────────────────────────────────────────────────────
  const nurseUser2 = await prisma.user.upsert({
    where: { email: 'arjana@test.com' },
    update: {},
    create: {
      name: 'Arjana Teli',
      email: 'arjana@test.com',
      passwordHash: await hash('test123'),
      role: 'NURSE',
      status: 'ACTIVE',
      phone: '+355693456789',
      country: 'Albania',
      city: 'Tirana',
    },
  });
  await prisma.nurse.upsert({
    where: { userId: nurseUser2.id },
    update: {},
    create: {
      userId: nurseUser2.id,
      status: 'PENDING',
      city: 'Tirana',
      availability: JSON.stringify(['Tuesday', 'Thursday']),
    },
  });
  console.log('✅ Pending nurse:', nurseUser2.email);

  // ── Test Client (UNLIMITED bookings) ──────────────────────────────────────
  const client = await prisma.user.upsert({
    where: { email: 'client@test.com' },
    update: { status: 'ACTIVE' },
    create: {
      name: 'Arta Murati',
      email: 'client@test.com',
      passwordHash: await hash('test123'),
      role: 'CLIENT',
      status: 'ACTIVE',
      phone: '+447700900000',
      country: 'United Kingdom',
      city: 'Tirana',
    },
  });

  // visitsPerMonth: 999 = unlimited test mode (booking route checks >= 999)
  await prisma.subscription.upsert({
    where: { userId: client.id },
    update: {
      plan: 'premium',
      status: 'ACTIVE',
      visitsPerMonth: 999,
      visitsUsed: 0,
      currentPeriodEnd: FAR_FUTURE,
      trialEndsAt: FAR_FUTURE,
    },
    create: {
      userId: client.id,
      plan: 'premium',
      status: 'ACTIVE',
      visitsPerMonth: 999,
      visitsUsed: 0,
      currentPeriodStart: new Date(),
      currentPeriodEnd: FAR_FUTURE,
      trialEndsAt: FAR_FUTURE,
    },
  });

  // Upsert relative (find existing first to avoid duplicates)
  let relative = await prisma.relative.findFirst({ where: { clientId: client.id } });
  if (!relative) {
    relative = await prisma.relative.create({
      data: {
        clientId: client.id,
        name: 'Fatmira Murati',
        age: 74,
        phone: '+355690001111',
        city: 'Tirana',
        address: 'Rruga e Elbasanit 14, Tirana',
        relationship: 'Mother',
        healthNotes: 'Has diabetes. Check glucose at each visit.',
      },
    });
  }
  console.log('✅ Client:', client.email, '(unlimited visits)');

  // ── Test Client 2 (for multi-account testing) ─────────────────────────────
  const client2 = await prisma.user.upsert({
    where: { email: 'client2@test.com' },
    update: { status: 'ACTIVE' },
    create: {
      name: 'Besmir Haxhiu',
      email: 'client2@test.com',
      passwordHash: await hash('test123'),
      role: 'CLIENT',
      status: 'ACTIVE',
      phone: '+447700900001',
      country: 'Italy',
      city: 'Tirana',
    },
  });
  await prisma.subscription.upsert({
    where: { userId: client2.id },
    update: { status: 'ACTIVE', visitsPerMonth: 999, visitsUsed: 0, currentPeriodEnd: FAR_FUTURE, trialEndsAt: FAR_FUTURE },
    create: {
      userId: client2.id,
      plan: 'premium',
      status: 'ACTIVE',
      visitsPerMonth: 999,
      visitsUsed: 0,
      currentPeriodStart: new Date(),
      currentPeriodEnd: FAR_FUTURE,
      trialEndsAt: FAR_FUTURE,
    },
  });
  let relative2 = await prisma.relative.findFirst({ where: { clientId: client2.id } });
  if (!relative2) {
    relative2 = await prisma.relative.create({
      data: {
        clientId: client2.id,
        name: 'Agron Haxhiu',
        age: 68,
        phone: '+355690002222',
        city: 'Tirana',
        address: 'Rruga Myslym Shyri 5, Tirana',
        relationship: 'Father',
        healthNotes: 'Hypertension. Monthly BP monitoring required.',
      },
    });
  }
  console.log('✅ Client 2:', client2.email, '(unlimited visits)');

  // ── Sample completed visit (for testing reports) ───────────────────────────
  const existingCompleted = await prisma.visit.findFirst({
    where: { relativeId: relative.id, status: 'COMPLETED' },
  });
  if (!existingCompleted) {
    await prisma.visit.create({
      data: {
        relativeId: relative.id,
        nurseId: nurseProfile.id,
        serviceType: 'Blood Pressure + Glucose Check',
        status: 'COMPLETED',
        scheduledAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
        bpSystolic: 128,
        bpDiastolic: 82,
        heartRate: 72,
        glucose: 5.4,
        temperature: 36.8,
        oxygenSat: 97,
        nurseNotes: 'Patient in good spirits. BP slightly elevated — recommend monitoring. Glucose in normal range.',
        reportSent: true,
      },
    });
    console.log('✅ Sample completed visit created');
  }

  console.log('');
  console.log('🎉 Test accounts ready:');
  console.log('');
  console.log('  Role    │ Email              │ Password');
  console.log('  ────────┼────────────────────┼──────────');
  console.log('  Admin   │ admin@test.com      │ test123');
  console.log('  Nurse   │ nurse@test.com      │ test123');
  console.log('  Nurse   │ arjana@test.com     │ test123  (pending)');
  console.log('  Client  │ client@test.com     │ test123  (unlimited bookings)');
  console.log('  Client  │ client2@test.com    │ test123  (unlimited bookings)');
  console.log('');
  console.log('  ⚡ Both clients have visitsPerMonth=999 (no booking limit)');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => prisma.$disconnect());
