import "server-only";

import { prisma } from "@/src/server/db/client";

export async function getAdditionalServices() {
  return prisma.additionalService.findMany({
    where: { isActive: true },
    orderBy: { isFeatured: "desc" },
  });
}
