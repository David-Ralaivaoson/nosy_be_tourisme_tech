import "server-only";

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Client Prisma singleton.
 * Utilise server-only pour empêcher tout import côté navigateur.
 * En développement, on attache l'instance à globalThis pour éviter
 * l'accumulation de connexions lors du hot-reload Next.js.
 */
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
