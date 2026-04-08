import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// PUT /api/users/profile — update profile
export async function PUT(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { name, phone } = body;

  const updated = await prisma.user.update({
    where: { id: auth.user.userId },
    data: {
      ...(name && { name }),
      ...(phone && { phone }),
    },
    include: { vehicles: true },
  });

  return NextResponse.json({
    user: {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      phone: updated.phone,
      role: updated.role,
      isPmr: updated.isPmr,
      pmrRequested: updated.pmrRequested,
      pmrValidatedAt: updated.pmrValidatedAt,
      vehicles: updated.vehicles.map((v) => ({ id: v.id, licensePlate: v.licensePlate })),
    },
  });
}
