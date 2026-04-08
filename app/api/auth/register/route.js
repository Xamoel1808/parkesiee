import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, name, phone, licensePlate } = body;

    // Validation
    if (!email || !password || !name || !phone || !licensePlate) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires : email, mot de passe, nom, téléphone, plaque.' },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 409 });
    }

    // Vérifier si la plaque existe déjà
    const existingPlate = await prisma.vehicle.findUnique({ where: { licensePlate: licensePlate.toUpperCase() } });
    if (existingPlate) {
      return NextResponse.json({ error: 'Cette plaque d\'immatriculation est déjà enregistrée.' }, { status: 409 });
    }

    // Créer l'utilisateur et le véhicule
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone,
        passwordHash,
        role: 'STUDENT',
        vehicles: {
          create: { licensePlate: licensePlate.toUpperCase() },
        },
      },
      include: { vehicles: true },
    });

    const token = createToken(user);

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isPmr: user.isPmr,
        vehicles: user.vehicles.map((v) => ({ id: v.id, licensePlate: v.licensePlate })),
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
