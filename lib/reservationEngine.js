/**
 * Moteur de Réservation — Parking ESIEE-IT
 *
 * Implémente toutes les règles métier :
 *  1. Max 1 réservation active par étudiant
 *  2. Fenêtre de réservation (24h standard, 48h PMR si places PMR pleines)
 *  3. Rotation (max N jours consécutifs)
 *  4. Attribution de place (PMR prioritaire, puis standard)
 */

import { prisma } from './prisma.js';

const MAX_CONSECUTIVE_DAYS = parseInt(process.env.MAX_CONSECUTIVE_DAYS || '5', 10);

/**
 * Tente de créer une réservation pour un étudiant.
 * @param {string} userId - ID de l'utilisateur
 * @param {string} dateStr - Date souhaitée au format YYYY-MM-DD
 * @returns {{ success: boolean, reservation?: object, error?: string }}
 */
export async function createReservation(userId, dateStr) {
  // Charger l'utilisateur complet
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { vehicles: true },
  });

  if (!user) {
    return { success: false, error: "Utilisateur introuvable." };
  }

  if (user.vehicles.length === 0) {
    return { success: false, error: "Vous devez d'abord enregistrer un véhicule (plaque d'immatriculation)." };
  }

  // On bloque systématiquement l'utilisateur si la date actuelle n'a pas dépassé sa fin de pénalité consécutive à un "No-show".
  if (user.penaltyUntil && new Date(user.penaltyUntil) > new Date()) {
    const penaltyStr = formatDateFR(dateToStr(new Date(user.penaltyUntil)));
    return { success: false, error: `Vous êtes actuellement pénalisé pour non-présentation jusqu'au ${penaltyStr}. Vous ne pouvez pas réserver.` };
  }

  // Limitation anti-monopole : empêche un compte de détenir deux réservations confirmées futures simultanément.
  const activeReservation = await prisma.reservation.findFirst({
    where: {
      userId,
      status: 'CONFIRMED',
      date: { gte: todayStr() },
    },
  });

  if (activeReservation) {
    return {
      success: false,
      error: `Vous avez déjà une réservation active pour le ${formatDateFR(activeReservation.date)}. Une seule réservation à la fois est autorisée.`,
    };
  }

  // La fenêtre d'ouverture est calculée dynamiquement :
  // Normalement J+1. Toutefois, si un profil PMR voit que toutes les places PMR
  // du jour visé sont déjà prises, son calendrier d'accès l'autorise exceptionnellement à J+2 sur place Standard.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = parseDate(dateStr);

  if (targetDate <= today) {
    return { success: false, error: "Impossible de réserver pour aujourd'hui ou une date passée." };
  }

  // Déterminer la fenêtre en fonction du statut PMR
  let windowDays = 1; // 24h = demain
  let usedPmrPriority = false;

  if (user.isPmr && user.pmrValidatedAt) {
    // Vérifier s'il reste des places PMR pour cette date
    const totalPmrSpots = await prisma.parkingSpot.count({
      where: { type: 'PMR', isActive: true },
    });
    const reservedPmrSpots = await prisma.reservation.count({
      where: {
        date: dateStr,
        status: 'CONFIRMED',
        spot: { type: 'PMR' },
      },
    });

    if (reservedPmrSpots >= totalPmrSpots) {
      // Places PMR pleines → fenêtre 48h pour les standards
      windowDays = 2;
      usedPmrPriority = true;
    } else {
      windowDays = 1;
    }
  }

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + windowDays);
  maxDate.setHours(23, 59, 59, 999);

  if (targetDate > maxDate) {
    const jours = windowDays === 1 ? "24h" : "48h";
    return {
      success: false,
      error: `Les réservations ne sont ouvertes que ${jours} à l'avance. Vous pouvez réserver au plus tard pour le ${formatDateFR(dateToStr(maxDate))}.`,
    };
  }

  // Pour éviter la privatisation à l'année du parking, la réservation échoue
  // si on identifie algorithmiquement que l'étudiant a enchaîné MAX_CONSECUTIVE_DAYS de stationnement.
  const consecutiveDays = await countConsecutiveDays(userId, dateStr);
  if (consecutiveDays >= MAX_CONSECUTIVE_DAYS) {
    return {
      success: false,
      error: `Vous avez utilisé le parking ${MAX_CONSECUTIVE_DAYS} jours consécutifs. Pour des raisons d'équité, veuillez laisser votre place à d'autres étudiants. Vous pourrez réserver à nouveau après un jour de pause.`,
    };
  }

  // ── RÈGLE 4 : Attribution de place ──
  let spot = null;

  if (user.isPmr && user.pmrValidatedAt && !usedPmrPriority) {
    // Essayer une place PMR d'abord
    spot = await findAvailableSpot(dateStr, 'PMR');
  }

  if (!spot) {
    // Place standard
    spot = await findAvailableSpot(dateStr, 'STANDARD');
  }

  if (!spot) {
    return { success: false, error: "Aucune place disponible pour cette date. Le parking est complet." };
  }

  // Créer la réservation
  const reservation = await prisma.reservation.create({
    data: {
      userId,
      spotId: spot.id,
      date: dateStr,
      status: 'CONFIRMED',
    },
    include: {
      spot: true,
      user: { select: { name: true, email: true, phone: true } },
    },
  });

  // Log SMS (simulé)
  console.log(`📱 SMS → ${user.phone}: Réservation confirmée — Place n°${spot.spotNumber} (${spot.type}) pour le ${formatDateFR(dateStr)}`);

  return { success: true, reservation };
}

/**
 * Annule une réservation existante
 */
export async function cancelReservation(userId, reservationId) {
  const reservation = await prisma.reservation.findFirst({
    where: { id: reservationId, userId, status: 'CONFIRMED' },
  });

  if (!reservation) {
    return { success: false, error: "Réservation non trouvée ou déjà annulée." };
  }

  // Vérifier que la date n'est pas passée
  const today = todayStr();
  if (reservation.date < today) {
    return { success: false, error: "Impossible d'annuler une réservation passée." };
  }

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'CANCELLED' },
  });

  return { success: true };
}

/**
 * Renvoie la disponibilité d'une date
 */
export async function getAvailability(dateStr) {
  const allSpots = await prisma.parkingSpot.findMany({
    where: { isActive: true },
    orderBy: { spotNumber: 'asc' },
  });

  const reservedSpotIds = await prisma.reservation.findMany({
    where: { date: dateStr, status: 'CONFIRMED' },
    select: { spotId: true },
  });

  const reservedSet = new Set(reservedSpotIds.map((r) => r.spotId));

  const standardTotal = allSpots.filter((s) => s.type === 'STANDARD').length;
  const pmrTotal = allSpots.filter((s) => s.type === 'PMR').length;
  const standardAvailable = allSpots.filter((s) => s.type === 'STANDARD' && !reservedSet.has(s.id)).length;
  const pmrAvailable = allSpots.filter((s) => s.type === 'PMR' && !reservedSet.has(s.id)).length;

  return {
    date: dateStr,
    standard: { total: standardTotal, available: standardAvailable },
    pmr: { total: pmrTotal, available: pmrAvailable },
    totalAvailable: standardAvailable + pmrAvailable,
    totalSpots: standardTotal + pmrTotal,
  };
}

// ── Helper Functions ──

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function dateToStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDateFR(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

async function findAvailableSpot(dateStr, type) {
  const reservedSpotIds = await prisma.reservation.findMany({
    where: { date: dateStr, status: 'CONFIRMED', spot: { type } },
    select: { spotId: true },
  });
  const reservedSet = new Set(reservedSpotIds.map((r) => r.spotId));

  const spots = await prisma.parkingSpot.findMany({
    where: { type, isActive: true },
    orderBy: { spotNumber: 'asc' },
  });

  return spots.find((s) => !reservedSet.has(s.id)) || null;
}

async function countConsecutiveDays(userId, targetDateStr) {
  // Analyse en remontant le temps, jour par jour à partir de la veille de la date cible.
  // La boucle se brise (break) au premier jour sans réservation, garantissant un comptage strictement ininterrompu.
  let count = 0;
  let checkDate = parseDate(targetDateStr);

  for (let i = 0; i < MAX_CONSECUTIVE_DAYS + 1; i++) {
    checkDate.setDate(checkDate.getDate() - 1);
    const dateStr = dateToStr(checkDate);

    const hasReservation = await prisma.reservation.findFirst({
      where: {
        userId,
        date: dateStr,
        status: 'CONFIRMED',
      },
    });

    if (hasReservation) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

export function addBusinessDays(startDate, days) {
  let currentDate = new Date(startDate);
  let addedDays = 0;
  while (addedDays < days) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dayOfWeek = currentDate.getDay(); // 0 = Dimanche, 6 = Samedi
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      addedDays++;
    }
  }
  return currentDate;
}
