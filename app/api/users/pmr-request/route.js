import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// POST /api/users/pmr-request — Request PMR status
export async function POST(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const user = await prisma.user.findUnique({ where: { id: auth.user.userId } });

  if (user.isPmr && user.pmrValidatedAt) {
    return NextResponse.json({ error: 'Votre statut PMR est déjà validé.' }, { status: 400 });
  }

  if (user.pmrRequested) {
    return NextResponse.json({ error: 'Une demande PMR est déjà en cours de traitement.' }, { status: 400 });
  }

  const { pmrProof } = await request.json();

  if (!pmrProof) {
    return NextResponse.json({ error: 'Un justificatif (photo ou PDF) est requis.' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: auth.user.userId },
    data: { pmrRequested: true, pmrProof },
  });

  return NextResponse.json({ message: 'Demande de statut PMR soumise. Un administrateur va la traiter.' });
}
