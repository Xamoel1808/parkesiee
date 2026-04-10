// Prisma client initialization
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

// If the existing prisma client is missing the 'ticket' model (stale from old generation), force a new one.
let prismaInstance = globalForPrisma.prisma;
if (prismaInstance && !prismaInstance.ticket) {
  console.log('Detected stale Prisma client (missing ticket model). Recreating...');
  prismaInstance = undefined;
}

export const prisma = prismaInstance ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

