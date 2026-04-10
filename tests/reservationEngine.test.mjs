import test from 'node:test';
import assert from 'node:assert/strict';
import { createReservation, getAvailability } from '../lib/reservationEngine.js';

function makeSpot(id, spotNumber, type) {
  return { id, spotNumber, type, isActive: true };
}

function makeUser(overrides = {}) {
  return {
    id: 'user-1',
    email: 'user@example.com',
    name: 'Test User',
    phone: '0600000000',
    role: 'STUDENT',
    isPmr: false,
    pmrValidatedAt: null,
    pmrRequested: false,
    penaltyUntil: null,
    vehicles: [{ id: 'vehicle-1', licensePlate: 'AA-123-AA' }],
    ...overrides,
  };
}

function clone(value) {
  return structuredClone(value);
}

function futureDate(daysAhead) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function matchesReservationWhere(record, where, spotLookup) {
  if (where.id && record.id !== where.id) return false;
  if (where.userId && record.userId !== where.userId) return false;
  if (where.status && record.status !== where.status) return false;

  if (where.date) {
    if (typeof where.date === 'object' && where.date.gte && record.date < where.date.gte) {
      return false;
    }
    if (typeof where.date === 'string' && record.date !== where.date) {
      return false;
    }
  }

  if (where.spot?.type) {
    const spot = spotLookup.get(record.spotId);
    if (!spot || spot.type !== where.spot.type) return false;
  }

  return true;
}

function createMockPrisma({ users = [], spots = [], reservations = [] } = {}) {
  const state = {
    users: users.map(clone),
    spots: spots.map(clone),
    reservations: reservations.map(clone),
  };

  const spotLookup = new Map(state.spots.map((spot) => [spot.id, spot]));
  const userById = new Map(state.users.map((user) => [user.id, user]));
  const userByEmail = new Map(state.users.map((user) => [user.email, user]));

  return {
    state,
    user: {
      findUnique: async ({ where }) => {
        const user = where.id ? userById.get(where.id) : userByEmail.get(where.email);
        return user ? clone(user) : null;
      },
      update: async ({ where, data }) => {
        const user = where.id ? userById.get(where.id) : userByEmail.get(where.email);
        if (!user) throw new Error('User not found');
        Object.assign(user, data);
        return clone(user);
      },
    },
    parkingSpot: {
      count: async ({ where }) => state.spots.filter((spot) => {
        if (where.type && spot.type !== where.type) return false;
        if (where.isActive !== undefined && spot.isActive !== where.isActive) return false;
        return true;
      }).length,
      findMany: async ({ where, orderBy }) => {
        const result = state.spots.filter((spot) => {
          if (where?.type && spot.type !== where.type) return false;
          if (where?.isActive !== undefined && spot.isActive !== where.isActive) return false;
          return true;
        });

        if (orderBy?.spotNumber === 'asc') {
          result.sort((left, right) => left.spotNumber - right.spotNumber);
        }

        return result.map(clone);
      },
      findUnique: async ({ where }) => {
        if (where.spotNumber === undefined) return null;
        const spot = state.spots.find((entry) => entry.spotNumber === where.spotNumber);
        return spot ? clone(spot) : null;
      },
    },
    reservation: {
      findFirst: async ({ where }) => {
        const record = state.reservations.find((reservation) => matchesReservationWhere(reservation, where, spotLookup));
        return record ? clone(record) : null;
      },
      findMany: async ({ where, select }) => {
        const records = state.reservations.filter((reservation) => matchesReservationWhere(reservation, where, spotLookup));
        if (select) {
          return records.map((reservation) => {
            const selected = {};
            for (const key of Object.keys(select)) {
              if (select[key]) selected[key] = reservation[key];
            }
            return selected;
          });
        }
        return records.map(clone);
      },
      count: async ({ where }) => state.reservations.filter((reservation) => matchesReservationWhere(reservation, where, spotLookup)).length,
      create: async ({ data, include }) => {
        const spot = spotLookup.get(data.spotId);
        const user = userById.get(data.userId);
        const created = {
          id: `reservation-${state.reservations.length + 1}`,
          ...data,
          createdAt: new Date('2099-01-01T00:00:00.000Z'),
        };
        state.reservations.push(created);

        const result = clone(created);
        if (include?.spot) {
          result.spot = clone(spot);
        }
        if (include?.user) {
          if (include.user.select) {
            const selectedUser = {};
            for (const key of Object.keys(include.user.select)) {
              if (include.user.select[key]) selectedUser[key] = user[key];
            }
            result.user = selectedUser;
          } else {
            result.user = clone(user);
          }
        }

        return result;
      },
      update: async ({ where, data }) => {
        const reservation = state.reservations.find((entry) => entry.id === where.id);
        if (!reservation) throw new Error('Reservation not found');
        Object.assign(reservation, data);
        return clone(reservation);
      },
    },
  };
}

test('createReservation rejects users without a vehicle', async () => {
  const db = createMockPrisma({
    users: [makeUser({ vehicles: [] })],
    spots: [makeSpot('spot-standard-1', 6, 'STANDARD')],
  });

  const result = await createReservation('user-1', '2099-01-10', db);

  assert.equal(result.success, false);
  assert.match(result.error, /v[ée]hicule/i);
});

test('createReservation rejects penalized users', async () => {
  const db = createMockPrisma({
    users: [makeUser({ penaltyUntil: new Date('2099-12-31T00:00:00.000Z') })],
    spots: [makeSpot('spot-standard-1', 6, 'STANDARD')],
  });

  const result = await createReservation('user-1', '2099-01-10', db);

  assert.equal(result.success, false);
  assert.match(result.error, /p[né]nalis/i);
});

test('createReservation rejects users with an active future reservation', async () => {
  const activeDate = futureDate(1);
  const targetDate = futureDate(2);
  const db = createMockPrisma({
    users: [makeUser()],
    spots: [makeSpot('spot-standard-1', 6, 'STANDARD')],
    reservations: [
      {
        id: 'reservation-existing',
        userId: 'user-1',
        spotId: 'spot-standard-1',
        date: activeDate,
        status: 'CONFIRMED',
      },
    ],
  });

  const result = await createReservation('user-1', targetDate, db);

  assert.equal(result.success, false);
  assert.match(result.error, /une seule r[eé]servation/i);
});

test('createReservation assigns an available standard spot', async () => {
  const db = createMockPrisma({
    users: [makeUser()],
    spots: [makeSpot('spot-standard-1', 6, 'STANDARD')],
  });

  const result = await createReservation('user-1', futureDate(1), db);

  assert.equal(result.success, true);
  assert.equal(result.reservation.spot.spotNumber, 6);
  assert.equal(result.reservation.spot.type, 'STANDARD');
  assert.equal(result.reservation.status, 'CONFIRMED');
});

test('createReservation prefers PMR spots for validated PMR users', async () => {
  const db = createMockPrisma({
    users: [makeUser({ isPmr: true, pmrValidatedAt: new Date('2099-01-01T00:00:00.000Z') })],
    spots: [
      makeSpot('spot-pmr-1', 1, 'PMR'),
      makeSpot('spot-standard-1', 6, 'STANDARD'),
    ],
  });

  const result = await createReservation('user-1', futureDate(1), db);

  assert.equal(result.success, true);
  assert.equal(result.reservation.spot.spotNumber, 1);
  assert.equal(result.reservation.spot.type, 'PMR');
});

test('getAvailability counts remaining spots correctly', async () => {
  const db = createMockPrisma({
    spots: [
      makeSpot('spot-pmr-1', 1, 'PMR'),
      makeSpot('spot-standard-1', 6, 'STANDARD'),
      makeSpot('spot-standard-2', 7, 'STANDARD'),
    ],
    reservations: [
      {
        id: 'reservation-1',
        userId: 'user-1',
        spotId: 'spot-standard-1',
        date: '2099-01-10',
        status: 'CONFIRMED',
      },
      {
        id: 'reservation-2',
        userId: 'user-2',
        spotId: 'spot-pmr-1',
        date: '2099-01-10',
        status: 'CONFIRMED',
      },
    ],
  });

  const availability = await getAvailability('2099-01-10', db);

  assert.equal(availability.standard.total, 2);
  assert.equal(availability.standard.available, 1);
  assert.equal(availability.pmr.total, 1);
  assert.equal(availability.pmr.available, 0);
  assert.equal(availability.totalAvailable, 1);
});