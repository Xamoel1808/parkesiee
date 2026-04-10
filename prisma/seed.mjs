// prisma/seed.mjs — Seeds the database with parking spots and an admin user
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function dateToStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

async function ensureUser({
  email,
  name,
  phone,
  password,
  role = 'STUDENT',
  isPmr = false,
  pmrRequested = false,
  pmrValidatedAt = null,
  penaltyUntil = null,
  licensePlate = null,
}) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
    include: { vehicles: true },
  });

  const passwordHash = await bcrypt.hash(password, 10);

  if (!existingUser) {
    await prisma.user.create({
      data: {
        email,
        name,
        phone,
        passwordHash,
        role,
        isPmr,
        pmrRequested,
        pmrValidatedAt,
        penaltyUntil,
        ...(licensePlate
          ? {
              vehicles: {
                create: { licensePlate },
              },
            }
          : {}),
      },
    });
    return;
  }

  await prisma.user.update({
    where: { email },
    data: {
      name,
      phone,
      passwordHash,
      role,
      isPmr,
      pmrRequested,
      pmrValidatedAt,
      penaltyUntil,
    },
  });

  if (licensePlate) {
    const hasVehicle = existingUser.vehicles.some((vehicle) => vehicle.licensePlate === licensePlate);
    if (!hasVehicle) {
      await prisma.vehicle.create({
        data: {
          licensePlate,
          userId: existingUser.id,
        },
      });
    }
  }
}

async function ensureReservation({ email, date, spotNumber }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return;

  const existingReservation = await prisma.reservation.findFirst({
    where: {
      userId: user.id,
      date,
      status: 'CONFIRMED',
    },
  });

  if (existingReservation) return;

  const spot = await prisma.parkingSpot.findUnique({ where: { spotNumber } });
  if (!spot) return;

  await prisma.reservation.create({
    data: {
      userId: user.id,
      spotId: spot.id,
      date,
      status: 'CONFIRMED',
    },
  });
}

async function main() {
  console.log('🌱 Seeding database...');

  console.log('🧹 Resetting local demo data...');
  await prisma.reservation.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
  await prisma.parkingSpot.deleteMany();

  // Create parking spots: 50 standard + 5 PMR
  const existingSpots = await prisma.parkingSpot.count();
  if (existingSpots === 0) {
    const spots = [];
    // PMR spots: 1-5
    for (let i = 1; i <= 5; i++) {
      spots.push({ spotNumber: i, type: 'PMR', isActive: true });
    }
    // Standard spots: 6-55
    for (let i = 6; i <= 55; i++) {
      spots.push({ spotNumber: i, type: 'STANDARD', isActive: true });
    }
    await prisma.parkingSpot.createMany({ data: spots });
    console.log('✅ Created 55 parking spots (5 PMR + 50 Standard)');
  } else {
    console.log(`ℹ️  Spots already exist (${existingSpots}), skipping.`);
  }

  // Create admin user
  const adminEmail = 'admin@esiee-it.fr';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const hash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Administrateur',
        phone: '0100000000',
        passwordHash: hash,
        role: 'ADMIN',
      },
    });
    console.log('✅ Created admin user (admin@esiee-it.fr / admin123)');
  } else {
    console.log('ℹ️  Admin user already exists, skipping.');
  }

  // Create agent user
  const agentEmail = 'agent@esiee-it.fr';
  const existingAgent = await prisma.user.findUnique({ where: { email: agentEmail } });
  if (!existingAgent) {
    const hash = await bcrypt.hash('agent123', 10);
    await prisma.user.create({
      data: {
        email: agentEmail,
        name: 'Agent Sécurité',
        phone: '0100000001',
        passwordHash: hash,
        role: 'AGENT',
      },
    });
    console.log('✅ Created agent user (agent@esiee-it.fr / agent123)');
  } else {
    console.log('ℹ️  Agent user already exists, skipping.');
  }

  const today = new Date();
  const tomorrow = dateToStr(addDays(today, 1));

  await ensureUser({
    email: 'leo@esiee-it.fr',
    name: 'Leo Martin',
    phone: '0611111111',
    password: 'leo123',
    licensePlate: 'LEO-123',
  });

  await ensureUser({
    email: 'camille@esiee-it.fr',
    name: 'Camille Dupont',
    phone: '0622222222',
    password: 'camille123',
    licensePlate: 'VIDE-001',
  });

  await ensureUser({
    email: 'sarah@esiee-it.fr',
    name: 'Sarah Benali',
    phone: '0633333333',
    password: 'sarah123',
    isPmr: true,
    pmrValidatedAt: today,
    licensePlate: 'PMR-001',
  });

  await ensureUser({
    email: 'nadia@esiee-it.fr',
    name: 'Nadia PMR',
    phone: '0644444444',
    password: 'nadia123',
    pmrRequested: true,
    licensePlate: 'PMR-REQ',
  });

  await ensureUser({
    email: 'julien@esiee-it.fr',
    name: 'Julien No Show',
    phone: '0655555555',
    password: 'noshow123',
    penaltyUntil: addDays(today, 7),
    licensePlate: 'NOSHOW-1',
  });

  await ensureReservation({
    email: 'leo@esiee-it.fr',
    date: tomorrow,
    spotNumber: 6,
  });

  await ensureReservation({
    email: 'sarah@esiee-it.fr',
    date: tomorrow,
    spotNumber: 1,
  });

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
