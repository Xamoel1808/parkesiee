import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const vehicles = await prisma.vehicle.findMany({
    where: { userId: auth.user.userId },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    vehicles: vehicles.map((v) => ({ id: v.id, licensePlate: v.licensePlate, createdAt: v.createdAt })),
  });
}

export async function POST(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const body = await request.json();
  const { licensePlate } = body;

  if (!licensePlate || licensePlate.trim() === '') {
    return NextResponse.json({ error: 'La plaque d\'immatriculation est requise.' }, { status: 400 });
  }

  // Vérifier si la plaque existe déjà pour un autre utilisateur
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { licensePlate: licensePlate.trim() }
  });

  if (existingVehicle) {
    return NextResponse.json({ error: 'Cette plaque d\'immatriculation est déjà enregistrée.' }, { status: 400 });
  }

  // Créer le véhicule pour l'utilisateur
  const newVehicle = await prisma.vehicle.create({
    data: {
      licensePlate: licensePlate.trim(),
      userId: auth.user.userId
    }
  });

  return NextResponse.json({ message: 'Véhicule ajouté avec succès.', vehicle: newVehicle }, { status: 201 });
}
