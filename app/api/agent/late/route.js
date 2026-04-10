import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
  const auth = requireAuth(request, ['ADMIN', 'AGENT']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { reservationId } = await request.json();
  if (!reservationId) {
    return NextResponse.json({ error: 'reservationId est requis' }, { status: 400 });
  }

  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) {
    return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 });
  }

  // Si on est en retard de plus d'1h, on annule la réservation (Règlement intérieur)
  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'CANCELLED' }
  });

  return NextResponse.json({ message: 'Réservation annulée pour cause de retard.' });
}
