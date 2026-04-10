import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { addBusinessDays } from '@/lib/reservationEngine';

export async function POST(request) {
  const auth = requireAuth(request, ['ADMIN', 'AGENT']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { userId } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: 'userId est requis' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
  }

  // Punition de 3 jours ouvrés
  const penaltyDate = addBusinessDays(new Date(), 3);

  await prisma.user.update({
    where: { id: userId },
    data: { penaltyUntil: penaltyDate }
  });

  return NextResponse.json({ 
    message: 'Pénalité de 3 jours ouvrés appliquée pour non-respect de la rotation.',
    penaltyUntil: penaltyDate
  });
}
