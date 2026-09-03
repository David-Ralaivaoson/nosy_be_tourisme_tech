import "server-only";

import { prisma } from "@/src/server/db/client";

export async function getVisibleReviews(limit = 6) {
  return prisma.review.findMany({
    where: { isVisible: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
