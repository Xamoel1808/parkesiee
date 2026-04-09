import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Paramètre id requis.' }, { status: 400 });
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id },
    include: { spot: true, user: true },
  });

  if (!reservation || reservation.userId !== auth.user.userId) {
    return NextResponse.json({ error: 'Réservation non trouvée.' }, { status: 404 });
  }

  const [year, month, day] = reservation.date.split('-');
  const startDate = `${year}${month}${day}T080000Z`;
  const endDate = `${year}${month}${day}T180000Z`;
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ESIEE-IT Parking//FR
BEGIN:VEVENT
UID:${reservation.id}@parking.esiee-it.fr
DTSTAMP:${now}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:Réservation Parking ESIEE-IT
DESCRIPTION:Place ${reservation.spot.spotNumber} (${reservation.spot.type})
LOCATION:Parking ESIEE-IT
STATUS:${reservation.status === 'CONFIRMED' ? 'CONFIRMED' : 'CANCELLED'}
END:VEVENT
END:VCALENDAR`;

  return new NextResponse(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="reservation-${reservation.date}.ics"`,
    },
  });
}
