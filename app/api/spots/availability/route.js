import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { getAvailability } from '@/lib/reservationEngine';

// GET /api/spots/availability?date=2024-01-15
export async function GET(request) {
  const auth = requireAuth(request);
  if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Paramètre date requis au format YYYY-MM-DD.' }, { status: 400 });
  }

  const availability = await getAvailability(date);
  return NextResponse.json(availability);
}
