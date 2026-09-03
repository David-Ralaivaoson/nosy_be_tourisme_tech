import { prisma } from "@/src/server/db/client";
import { AccommodationFilters } from "@/src/lib/validators/accommodation.schema";
import { Prisma } from "@prisma/client";

/**
 * Récupère tous les hébergements actifs avec filtres optionnels
 */
export async function getAccommodations(filters?: AccommodationFilters) {
  const where: Prisma.AccommodationWhereInput = {
    isActive: true,
  };

  if (filters?.category) {
    where.category = filters.category;
  }

  if (filters?.zone) {
    where.zone = filters.zone;
  }

  if (filters?.minPrice !== undefined) {
    where.pricePerNightLowSeason = { gte: filters.minPrice };
  }

  if (filters?.maxPrice !== undefined) {
    where.pricePerNightLowSeason = {
      ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
      lte: filters.maxPrice,
    };
  }

  if (filters?.stars !== undefined) {
    where.stars = filters.stars;
  }

  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { descriptionFr: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return prisma.accommodation.findMany({
    where,
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { isFeatured: "desc" },
  });
}

/**
 * Récupère un hébergement par son slug
 */
export async function getAccommodationBySlug(slug: string) {
  return prisma.accommodation.findUnique({
    where: { slug, isActive: true },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      seasonRates: {
        orderBy: { startDate: "asc" },
      },
    },
  });
}

export async function getFeaturedAccommodations(limit = 3) {
  return prisma.accommodation.findMany({
    where: { isActive: true, isFeatured: true },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { rating: "desc" },
    take: limit,
  });
}

/**
 * Récupère un hébergement par son ID (pour le devis)
 */
export async function getAccommodationById(id: string) {
  return prisma.accommodation.findUnique({
    where: { id, isActive: true },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      seasonRates: {
        orderBy: { startDate: "asc" },
      },
    },
  });
}
