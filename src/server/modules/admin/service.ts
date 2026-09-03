import "server-only";

import { prisma } from "@/src/server/db/client";

export async function getDashboardStats() {
  const [
    quotesCount,
    sentCount,
    confirmedCount,
    revenue,
    accCount,
    excCount,
    trCount,
    recent,
  ] = await Promise.all([
    prisma.quote.count(),
    prisma.quote.count({
      where: { status: { in: ["EMAIL_SENT", "CONTACTED", "CONFIRMED"] } },
    }),
    prisma.quote.count({ where: { status: "CONFIRMED" } }),
    prisma.quote.aggregate({ _sum: { total: true } }),
    prisma.accommodation.count(),
    prisma.excursion.count(),
    prisma.transportOption.count(),
    prisma.quote.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { items: { select: { id: true } } },
    }),
  ]);

  return {
    quotesCount,
    sentCount,
    confirmedCount,
    totalRevenue: revenue._sum.total ?? 0,
    accCount,
    excCount,
    trCount,
    recent,
  };
}

export async function getAdminQuotes() {
  return prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function getAdminAccommodations() {
  return prisma.accommodation.findMany({ orderBy: { name: "asc" } });
}
export async function getAdminAccommodation(id: string) {
  return prisma.accommodation.findUnique({ where: { id } });
}

export async function getAdminExcursions() {
  return prisma.excursion.findMany({ orderBy: { name: "asc" } });
}
export async function getAdminExcursion(id: string) {
  return prisma.excursion.findUnique({ where: { id } });
}

export async function getAdminTransports() {
  return prisma.transportOption.findMany({ orderBy: { name: "asc" } });
}
export async function getAdminTransport(id: string) {
  return prisma.transportOption.findUnique({ where: { id } });
}
