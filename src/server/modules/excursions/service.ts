import { prisma } from "@/src/server/db/client";
import { ExcursionFilters } from "@/src/lib/validators/excursion.schema";
import { Prisma } from "@prisma/client";

export async function getExcursions(filters?: ExcursionFilters) {
  const where: Prisma.ExcursionWhereInput = {
    isActive: true,
  };

  if (filters?.minPrice !== undefined) {
    where.pricePerPerson = { gte: filters.minPrice };
  }

  if (filters?.maxPrice !== undefined) {
    where.pricePerPerson = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      lte: filters.maxPrice,
    };
  }

  if (filters?.includesLunch !== undefined) {
    where.includesLunch = filters.includesLunch;
  }

  if (filters?.includesTransfer !== undefined) {
    where.includesTransfer = filters.includesTransfer;
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { descriptionFr: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.excursion.findMany({
    where,
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { isFeatured: "desc" },
  });
}

export async function getExcursionBySlug(slug: string) {
  return prisma.excursion.findUnique({
    where: { slug, isActive: true },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getExcursionsByIds(ids: string[]) {
  if (!ids || ids.length === 0) return [];

  return prisma.excursion.findMany({
    where: {
      id: { in: ids },
      isActive: true,
    },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
    },
  });
}

export async function getFeaturedExcursions(limit = 3) {
  return prisma.excursion.findMany({
    where: { isActive: true, isFeatured: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { name: "asc" },
    take: limit,
  });
}
