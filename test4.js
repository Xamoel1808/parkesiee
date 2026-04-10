import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.findFirst({
    where: { penaltyUntil: { not: null } },
    include: { vehicles: true }
  });
  if (user.vehicles.length === 0) {
    await prisma.vehicle.create({ data: { licensePlate: 'TEST-1234', userId: user.id } });
  }

  const studentToken = jwt.sign({ userId: user.id, role: 'STUDENT' }, 'parking-esiee-secret-dev');
  
  const dateStr = `2050-03-${Math.floor(Math.random() * 28 + 1).toString().padStart(2, '0')}`;
  console.log('Trying to reserve with penalty...');
  const res = await fetch('http://127.0.0.1:3001/api/reservations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${studentToken}`
    },
    body: JSON.stringify({ date: dateStr })
  });
  
  console.log('Reservation response:', await res.json());
}
run().catch(console.error).finally(() => prisma.$disconnect());
