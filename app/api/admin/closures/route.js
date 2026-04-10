import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { sendMail, buildClosureEmailHtml } from '@/lib/mailer';

// GET /api/admin/closures — Liste toutes les fermetures
export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'ADMIN') return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const closures = await prisma.parkingClosure.findMany({
    orderBy: { startDate: 'asc' },
  });

  return NextResponse.json({ closures });
}

// POST /api/admin/closures — Créer une fermeture (+ email optionnel)
export async function POST(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'ADMIN') return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const body = await request.json();
  const { startDate, endDate, reason, notifyUsers } = body;

  if (!startDate || !endDate || !reason?.trim()) {
    return NextResponse.json({ error: 'Paramètres startDate, endDate et reason requis.' }, { status: 400 });
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
    return NextResponse.json({ error: 'Dates invalides. Format attendu : YYYY-MM-DD.' }, { status: 400 });
  }

  if (startDate > endDate) {
    return NextResponse.json({ error: 'La date de début doit être avant ou égale à la date de fin.' }, { status: 400 });
  }

  const closure = await prisma.parkingClosure.create({
    data: { startDate, endDate, reason: reason.trim() },
  });

  // Envoi emails si demandé
  let emailResult = null;
  if (notifyUsers) {
    try {
      const users = await prisma.user.findMany({
        where: { role: 'STUDENT' },
        select: { email: true, name: true },
      });

      if (users.length > 0) {
        const emails = users.map(u => u.email);
        const html = buildClosureEmailHtml({ reason: reason.trim(), startDate, endDate });

        await sendMail({
          to: emails,
          subject: `🔒 Fermeture du parking ESIEE-IT — ${reason.trim()}`,
          html,
        });

        emailResult = { sent: users.length };
      }
    } catch (err) {
      console.error('Erreur envoi email:', err);
      emailResult = { error: err.message };
    }
  }

  return NextResponse.json({
    message: 'Fermeture planifiée avec succès.',
    closure,
    email: emailResult,
  }, { status: 201 });
}

// DELETE /api/admin/closures — Supprimer une fermeture
export async function DELETE(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });
  if (auth.user.role !== 'ADMIN') return NextResponse.json({ error: 'Accès refusé.' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Paramètre id requis.' }, { status: 400 });

  try {
    await prisma.parkingClosure.delete({ where: { id } });
    return NextResponse.json({ message: 'Fermeture supprimée.' });
  } catch {
    return NextResponse.json({ error: 'Fermeture introuvable.' }, { status: 404 });
  }
}
