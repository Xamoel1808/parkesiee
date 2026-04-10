import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';
import { createReservation, cancelReservation, getAvailability } from '../lib/reservationEngine.js';

const dbFilePath = path.resolve('prisma/integration-test.db');
const dbUrl = `file:${dbFilePath}`;

let prisma;
let studentId;

function dateToStr(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function tomorrowStr() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return dateToStr(date);
}

before(async () => {
  if (fs.existsSync(dbFilePath)) {
    fs.rmSync(dbFilePath);
  }

  execSync(`DATABASE_URL="${dbUrl}" npx prisma db push --skip-generate`, {
    stdio: 'ignore',
    shell: true,
  });

  prisma = new PrismaClient({
    datasources: {
      db: { url: dbUrl },
    },
  });

  await prisma.parkingSpot.createMany({
    data: [
      { spotNumber: 1, type: 'PMR', isActive: true },
      { spotNumber: 6, type: 'STANDARD', isActive: true },
    ],
  });

  const student = await prisma.user.create({
    data: {
      email: 'integration.student@esiee-it.fr',
      name: 'Integration Student',
      phone: '0601010101',
      passwordHash: 'hash',
      role: 'STUDENT',
      vehicles: {
        create: { licensePlate: 'INT-123' },
      },
    },
  });

  studentId = student.id;
});

after(async () => {
  if (prisma) {
    await prisma.$disconnect();
  }

  if (fs.existsSync(dbFilePath)) {
    fs.rmSync(dbFilePath);
  }
});

test('integration: reservation flow success then cancellation', async () => {
  await prisma.reservation.deleteMany();
  const reservationDate = tomorrowStr();

  const availabilityBefore = await getAvailability(reservationDate, prisma);
  assert.equal(availabilityBefore.totalAvailable, 2);

  const created = await createReservation(studentId, reservationDate, prisma);
  assert.equal(created.success, true);

  const availabilityAfterCreate = await getAvailability(reservationDate, prisma);
  assert.equal(availabilityAfterCreate.totalAvailable, 1);

  const cancelled = await cancelReservation(studentId, created.reservation.id, prisma);
  assert.equal(cancelled.success, true);

  const availabilityAfterCancel = await getAvailability(reservationDate, prisma);
  assert.equal(availabilityAfterCancel.totalAvailable, 2);
});

test('integration: second reservation is rejected while one is active', async () => {
  await prisma.reservation.deleteMany();
  const reservationDate = tomorrowStr();

  const first = await createReservation(studentId, reservationDate, prisma);
  assert.equal(first.success, true);

  const second = await createReservation(studentId, reservationDate, prisma);
  assert.equal(second.success, false);
  assert.match(second.error, /une seule réservation/i);
});
