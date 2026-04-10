import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET /api/tickets — Mes tickets
export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const tickets = await prisma.ticket.findMany({
    where: { userId: auth.user.userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ tickets });
}

// POST /api/tickets — Créer un ticket
export async function POST(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { subject, message } = body;

  if (!subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Sujet et message requis.' }, { status: 400 });
  }

  const ticket = await prisma.ticket.create({
    data: {
      userId: auth.user.userId,
      subject: subject.trim(),
      message: message.trim(),
    },
  });

  return NextResponse.json({
    message: 'Votre réclamation a été envoyée avec succès.',
    ticket,
  }, { status: 201 });
}
