import { prisma } from "@/src/server/db/client";
import { TransportFilters } from "@/src/lib/validators/transport.schema";
import { Prisma } from "@prisma/client";

export async function getTransports(filters?: TransportFilters) {
  const where: Prisma.TransportOptionWhereInput = {
    isActive: true,
  };

  if (filters?.type) {
    where.transportType = filters.type;
  }

  if (filters?.unit) {
    where.unit = filters.unit;
  }

  if (filters?.withDriver !== undefined) {
    where.withDriver = filters.withDriver;
  }

  if (filters?.minCapacity !== undefined) {
    where.capacity = { gte: filters.minCapacity };
  }

  return prisma.transportOption.findMany({
    where,
    orderBy: { transportType: "asc" },
  });
}

export async function getTransportBySlug(slug: string) {
  return prisma.transportOption.findUnique({
    where: { slug, isActive: true },
  });
}

export async function getTransportsByIds(ids: string[]) {
  if (!ids || ids.length === 0) return [];

  return prisma.transportOption.findMany({
    where: {
      id: { in: ids },
      isActive: true,
    },
  });
}

/**
 * Vérifie la disponibilité d'un véhicule pour une période
 */
export async function checkTransportAvailability(
  transportId: string,
  startDate: string,
  endDate: string,
): Promise<{ available: boolean; reason?: string }> {
  const bookings = await prisma.transportBooking.findMany({
    where: {
      transportOptionId: transportId,
      status: { in: ["PENDING", "CONFIRMED"] },
      OR: [
        {
          startDate: { lte: new Date(endDate) },
          endDate: { gte: new Date(startDate) },
        },
      ],
    },
  });

  if (bookings.length > 0) {
    return {
      available: false,
      reason: "Véhicule déjà réservé pour cette période",
    };
  }

  return { available: true };
}
