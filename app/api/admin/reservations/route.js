import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/reservations?date=YYYY-MM-DD — All reservations for a date
export async function GET(request) {
  const auth = requireAuth(request, ['ADMIN', 'AGENT']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date) {
    return NextResponse.json({ error: 'Paramètre date requis.' }, { status: 400 });
  }

  const reservations = await prisma.reservation.findMany({
    where: { date, status: 'CONFIRMED' },
    include: {
      spot: true,
      user: {
        select: { name: true, email: true, phone: true, isPmr: true },
        include: { vehicles: true },
      },
    },
    orderBy: { spot: { spotNumber: 'asc' } },
  });

  return NextResponse.json({
    date,
    count: reservations.length,
    reservations: reservations.map((r) => ({
      id: r.id,
      spotNumber: r.spot.spotNumber,
      spotType: r.spot.type,
      student: {
        name: r.user.name,
        email: r.user.email,
        phone: r.user.phone,
        isPmr: r.user.isPmr,
        licensePlates: r.user.vehicles.map((v) => v.licensePlate),
      },
    })),
  });
}
