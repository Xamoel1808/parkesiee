const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
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
  const dateStr = `2050-01-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`;
  
  const reservation = await prisma.reservation.create({
    data: { userId: user.id, spotId: spot.id, date: dateStr, status: 'CONFIRMED' }
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
