import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { createReservation, cancelReservation } from '@/lib/reservationEngine';

// POST /api/reservations — Create reservation
export async function POST(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { date } = body;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Paramètre date requis au format YYYY-MM-DD.' }, { status: 400 });
  }

  const result = await createReservation(auth.user.userId, date);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    message: 'Réservation confirmée !',
    reservation: {
      id: result.reservation.id,
      date: result.reservation.date,
      spotNumber: result.reservation.spot.spotNumber,
      spotType: result.reservation.spot.type,
      status: result.reservation.status,
    },
  }, { status: 201 });
}

// GET /api/reservations — My reservations
export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const reservations = await prisma.reservation.findMany({
    where: { userId: auth.user.userId },
    include: { spot: true },
    orderBy: { date: 'desc' },
    take: 20,
  });

  return NextResponse.json({
    reservations: reservations.map((r) => ({
      id: r.id,
      date: r.date,
      spotNumber: r.spot.spotNumber,
      spotType: r.spot.type,
      status: r.status,
      createdAt: r.createdAt,
    })),
  });
}

// DELETE /api/reservations — Cancel a reservation
export async function DELETE(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Paramètre id requis.' }, { status: 400 });
  }

  const result = await cancelReservation(auth.user.userId, id);
  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ message: 'Réservation annulée.' });
}
