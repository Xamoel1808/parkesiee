const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.create({
    data: {
      email: 'test@esiee.fr' + Date.now(),
      name: 'Test Penalty',
      phone: '0612345678',
      passwordHash: 'dummy'
    }
  });

  const spot = await prisma.parkingSpot.findFirst();
  
  const reservation = await prisma.reservation.create({
    data: {
      userId: user.id,
      spotId: spot.id,
      date: '2050-01-01',
      status: 'CONFIRMED'
    }
  });

  console.log('Reservation created:', reservation.id);
  
  // Apply penalty
  const res = await fetch('http://localhost:3000/api/agent/no-show', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // We don't have token but let's see. Wait, requireAuth will block us.
    },
    body: JSON.stringify({ reservationId: reservation.id })
  });
  console.log('No-show response:', await res.text());
}
run().catch(console.error).finally(() => prisma.$disconnect());
