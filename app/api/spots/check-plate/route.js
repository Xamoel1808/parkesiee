import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/spots/check-plate?plate=XX-XXX-XX
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');

  if (!plate) {
    return NextResponse.json({ error: "Paramètre 'plate' (plaque d'immatriculation) requis." }, { status: 400 });
  }

  try {
    const vehicle = await prisma.vehicle.findFirst({
      where: { licensePlate: { equals: plate.toUpperCase() } },
    });

    if (!vehicle) {
      return NextResponse.json({
        reserved: false,
        message: 'Véhicule non trouvé dans la base.',
      });
    }

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const reservation = await prisma.reservation.findFirst({
      where: {
        userId: vehicle.userId,
        date: todayStr,
        status: 'CONFIRMED',
      },
      include: { spot: true },
    });

    if (reservation) {
      return NextResponse.json({
        reserved: true,
        spotNumber: reservation.spot.spotNumber,
        spotType: reservation.spot.type,
        message: `La place n°${reservation.spot.spotNumber} est réservée pour ce véhicule.`,
      });
    } else {
      return NextResponse.json({
        reserved: false,
        message: "Pas de réservation pour aujourd'hui.",
      });
    }
  } catch (error) {
    console.error('Erreur check-plate:', error);
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 });
  }
}
