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
  const dateStr = `2050-02-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`;
  
  const reservation = await prisma.reservation.create({
    data: { userId: user.id, spotId: spot.id, date: dateStr, status: 'CONFIRMED' }
  });

  console.log('Sending penalty post...', reservation.id);
  const res = await fetch('http://127.0.0.1:3001/api/agent/no-show', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({ reservationId: reservation.id })
  });
  const text = await res.text();
  console.log('No-show response:', text);

  // also test ICS export
  const studentToken = jwt.sign({ userId: user.id, role: 'STUDENT' }, 'parking-esiee-secret-dev');
  const resIcs = await fetch(`http://127.0.0.1:3001/api/reservations/ics?id=${reservation.id}`, {
    headers: { 'Authorization': `Bearer ${studentToken}` }
  });
  console.log('ICS response head:', (await resIcs.text()).substring(0, 100));

  const updatedUser = await prisma.user.findUnique({ where: { id: user.id } });
  console.log('Penalty Until:', updatedUser.penaltyUntil);
}

run().catch(console.error).finally(() => prisma.$disconnect());
