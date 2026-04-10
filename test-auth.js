import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

async function run() {
  const adminToken = jwt.sign({ userId: 'admin', role: 'ADMIN' }, 'parking-esiee-secret-dev');

  const user = await prisma.user.create({
    data: {
      email: 'test' + Date.now() + '@esiee.fr',
      name: 'Test Penalty',
      phone: '0612345678',
      passwordHash: 'dummy'
    }
  });
  const spot = await prisma.parkingSpot.findFirst();
  const reservation = await prisma.reservation.create({
    data: { userId: user.id, spotId: spot.id, date: '2050-01-01', status: 'CONFIRMED' }
  });

  const res = await fetch('http://localhost:3000/api/agent/no-show', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ reservationId: reservation.id })
  });
  console.log('No-show response:', await res.json());

  const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
  console.log('Penalty Until:', updatedUser.penaltyUntil);
}
run().catch(console.error).finally(() => prisma.$disconnect());
