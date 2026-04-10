import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/users — List users (with PMR filter)
export async function GET(request) {
  const auth = requireAuth(request, ['ADMIN']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const pmrPending = searchParams.get('pmrPending') === 'true';

  const where = pmrPending ? { pmrRequested: true, pmrValidatedAt: null } : {};

  const users = await prisma.user.findMany({
    where,
    include: { vehicles: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      isPmr: u.isPmr,
      pmrRequested: u.pmrRequested,
      pmrValidatedAt: u.pmrValidatedAt,
      penaltyUntil: u.penaltyUntil,
      vehicles: u.vehicles.map((v) => v.licensePlate),
      createdAt: u.createdAt,
    })),
  });
}

// PUT /api/admin/users — Validate PMR status
export async function PUT(request) {
  const auth = requireAuth(request, ['ADMIN']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { userId, action } = body; // action: 'approve' or 'reject'

  if (!userId || !action) {
    return NextResponse.json({ error: 'userId et action requis.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé.' }, { status: 404 });
  }

  if (action === 'approve') {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isPmr: true,
        pmrRequested: false,
        pmrValidatedAt: new Date(),
      },
    });
    return NextResponse.json({ message: `Statut PMR approuvé pour ${user.name}.` });
  } else if (action === 'reject') {
    await prisma.user.update({
      where: { id: userId },
      data: { pmrRequested: false },
    });
    return NextResponse.json({ message: `Demande PMR rejetée pour ${user.name}.` });
  } else if (action === 'ban') {
    await prisma.user.update({
      where: { id: userId },
      data: { penaltyUntil: new Date('2099-12-31T23:59:59Z') },
    });
    return NextResponse.json({ message: `Utilisateur ${user.name} bloqué définitivement.` });
  } else if (action === 'pardon') {
    await prisma.user.update({
      where: { id: userId },
      data: { penaltyUntil: null },
    });
    return NextResponse.json({ message: `Sanction levée pour ${user.name}.` });
  }

  return NextResponse.json({ error: "Action invalide. Utilisez 'approve', 'reject', 'ban' ou 'pardon'." }, { status: 400 });
}
