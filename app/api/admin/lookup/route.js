import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/lookup?plate=XX-XXX-XX — Lookup by license plate
export async function GET(request) {
  const auth = requireAuth(request, ['ADMIN', 'AGENT']);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');

  if (!plate) {
    return NextResponse.json({ error: "Paramètre 'plate' requis." }, { status: 400 });
  }

  const vehicle = await prisma.vehicle.findFirst({
    where: { licensePlate: { equals: plate.toUpperCase() } },
    include: {
      user: {
        select: { id: true, name: true, email: true, phone: true, isPmr: true },
      },
    },
  });

  if (!vehicle) {
    return NextResponse.json({
      found: false,
      message: 'Aucun véhicule trouvé avec cette plaque.',
    });
  }

  // Check today's reservation
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const todayReservation = await prisma.reservation.findFirst({
    where: {
      userId: vehicle.user.id,
      date: todayStr,
      status: 'CONFIRMED',
    },
    include: { spot: true },
  });

  return NextResponse.json({
    found: true,
    vehicle: {
      licensePlate: vehicle.licensePlate,
      owner: {
        name: vehicle.user.name,
        email: vehicle.user.email,
        phone: vehicle.user.phone,
        isPmr: vehicle.user.isPmr,
      },
    },
    todayReservation: todayReservation
      ? {
          id: todayReservation.id,
          date: todayReservation.date,
          spotNumber: todayReservation.spot.spotNumber,
          spotType: todayReservation.spot.type,
          status: todayReservation.status,
          valid: true,
        }
      : {
          valid: false,
          message: "Aucune réservation valide pour aujourd'hui.",
        },
  });
}
