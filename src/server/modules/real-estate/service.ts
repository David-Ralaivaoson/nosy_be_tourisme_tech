import { prisma } from "@/src/server/db/client";
import {
  TerrainFilters,
  RealEstateInquiryInput,
} from "@/src/lib/validators/real-estate.schema";
import { Prisma } from "@prisma/client";

export async function getTerrains(filters?: TerrainFilters) {
  const where: Prisma.TerrainWhereInput = {
    isActive: true,
  };

  if (filters?.minSurface !== undefined) {
    where.surface = { gte: filters.minSurface };
  }

  if (filters?.maxSurface !== undefined) {
    where.surface = {
      ...(where.surface && typeof where.surface === "object"
        ? where.surface
        : {}),
      lte: filters.maxSurface,
    };
  }

  if (filters?.minPrice !== undefined) {
    where.price = { gte: filters.minPrice };
  }

  if (filters?.maxPrice !== undefined) {
    where.price = {
      ...(where.price && typeof where.price === "object" ? where.price : {}),
      lte: filters.maxPrice,
    };
  }

  if (filters?.statut) {
    where.statut = filters.statut;
  }

  if (filters?.vueMer !== undefined) {
    where.vueMer = filters.vueMer;
  }

  if (filters?.eau !== undefined) {
    where.eau = filters.eau;
  }

  if (filters?.electricite !== undefined) {
    where.electricite = filters.electricite;
  }

  if (filters?.exclusivite !== undefined) {
    where.exclusivite = filters.exclusivite;
  }

  return prisma.terrain.findMany({
    where,
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getTerrainBySlug(slug: string) {
  return prisma.terrain.findUnique({
    where: { slug, isActive: true },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      documents: {
        where: { isPublic: true },
      },
    },
  });
}

export async function createRealEstateInquiry(data: RealEstateInquiryInput) {
  return prisma.realEstateInquiry.create({
    data: {
      terrainId: data.terrainId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      message: data.message,
    },
  });
}
