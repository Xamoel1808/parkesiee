import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
  const auth = requireAuth(request, ['ADMIN', 'AGENT']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { reservationId } = body;

  if (!reservationId) {
    return NextResponse.json({ error: 'reservationId est requis' }, { status: 400 });
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    return NextResponse.json({ error: 'Réservation introuvable' }, { status: 404 });
  }

  const penaltyDate = new Date();
  penaltyDate.setDate(penaltyDate.getDate() + 7);

  await prisma.$transaction([
    prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'NO_SHOW' },
    }),
    prisma.user.update({
      where: { id: reservation.userId },
      data: { penaltyUntil: penaltyDate },
    }),
  ]);

  return NextResponse.json({
    message: 'Absence non justifiée déclarée, utilisateur pénalisé pour 7 jours.',
  });
}
