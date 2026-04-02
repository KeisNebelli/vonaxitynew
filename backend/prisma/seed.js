// backend/prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const hash = async (pw) => bcrypt.hash(pw, 10);

  // ── Admin ──────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
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
  console.log('✅ Admin created:', admin.email);

  // ── Nurse ──────────────────────────────────────────────────────────────────
  const nurseUser = await prisma.user.upsert({
    where: { email: 'nurse@test.com' },
    update: {},
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

  await prisma.nurse.upsert({
    where: { userId: nurseUser.id },
    update: {},
    create: {
      userId: nurseUser.id,
      status: 'APPROVED',
      city: 'Tirana',
      rating: 4.8,
      totalVisits: 47,
      totalEarnings: 940,
      payRatePerVisit: 20,
      availability: JSON.stringify(['Monday', 'Tuesday', 'Wednesday', 'Friday']),
      licenseNumber: 'ALB-NURSE-2024-001',
    },
  });
  console.log('✅ Nurse created:', nurseUser.email);

  // ── Second nurse (pending) ─────────────────────────────────────────────────
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
  console.log('✅ Pending nurse created:', nurseUser2.email);

  // ── Client ─────────────────────────────────────────────────────────────────
  const client = await prisma.user.upsert({
    where: { email: 'client@test.com' },
    update: {},
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

  // Subscription
  await prisma.subscription.upsert({
    where: { userId: client.id },
    update: {},
    create: {
      userId: client.id,
      plan: 'standard',
      status: 'ACTIVE',
      visitsPerMonth: 2,
      visitsUsed: 1,
      currentPeriodStart: new Date('2024-12-01'),
      currentPeriodEnd: new Date('2024-12-31'),
      trialEndsAt: new Date('2024-12-08'),
    },
  });

  // Relative
  const relative = await prisma.relative.create({
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

  // Get nurse profile
  const nurseProfile = await prisma.nurse.findUnique({ where: { userId: nurseUser.id } });

  // Completed visit
  await prisma.visit.create({
    data: {
      relativeId: relative.id,
      nurseId: nurseProfile.id,
      serviceType: 'Blood Pressure + Glucose Check',
      status: 'COMPLETED',
      scheduledAt: new Date('2024-11-28T10:00:00'),
      completedAt: new Date('2024-11-28T10:45:00'),
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

  // Upcoming visit
  await prisma.visit.create({
    data: {
      relativeId: relative.id,
      nurseId: nurseProfile.id,
      serviceType: 'Blood Pressure + Glucose Check',
      status: 'ACCEPTED',
      scheduledAt: new Date('2024-12-20T10:00:00'),
    },
  });

  // Unassigned visit
  await prisma.visit.create({
    data: {
      relativeId: relative.id,
      nurseId: null,
      serviceType: 'Welfare Check',
      status: 'UNASSIGNED',
      scheduledAt: new Date('2024-12-22T11:00:00'),
    },
  });

  // Payment record
  await prisma.payment.create({
    data: {
      userId: client.id,
      amount: 50,
      currency: 'eur',
      status: 'paid',
      description: 'Standard plan — December 2024',
    },
  });

  console.log('✅ Client created:', client.email);
  console.log('');
  console.log('🎉 Seed complete! Test accounts:');
  console.log('   Client:  client@test.com / test123');
  console.log('   Nurse:   nurse@test.com  / test123');
  console.log('   Admin:   admin@test.com  / test123');
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1); })
  .finally(async () => prisma.$disconnect());
