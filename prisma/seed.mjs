// prisma/seed.mjs — Seeds the database with parking spots and an admin user
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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
