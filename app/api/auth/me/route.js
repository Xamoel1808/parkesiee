import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.user.userId },
    include: { vehicles: true },
  });

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur non trouvé.' }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isPmr: user.isPmr,
      pmrRequested: user.pmrRequested,
      pmrValidatedAt: user.pmrValidatedAt,
      vehicles: user.vehicles.map((v) => ({ id: v.id, licensePlate: v.licensePlate })),
    },
  });
}
