import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/tickets — Tous les tickets
export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'ADMIN') return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const tickets = await prisma.ticket.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ tickets });
}

// PUT /api/admin/tickets — Mettre à jour un ticket (réponse/statut)
export async function PUT(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'ADMIN') return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const body = await request.json();
  const { id, status, adminResponse } = body;

  if (!id) {
    return NextResponse.json({ error: 'ID du ticket requis.' }, { status: 400 });
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data: {
      status,
      adminResponse,
    },
  });

  return NextResponse.json({
    message: 'Ticket mis à jour.',
    ticket,
  });
}
