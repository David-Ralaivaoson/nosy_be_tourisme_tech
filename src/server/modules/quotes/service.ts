import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/src/server/db/client";
import { CreateQuoteInput } from "@/src/lib/validators/quote.schema";
import {
  calculateNights,
  calculateAccommodationTotal,
  validateDates,
} from "@/src/lib/pricing";
import { getAccommodationById } from "../accommodations/service";
import { getExcursionsByIds } from "../excursions/service";
import {
  getTransportsByIds,
  checkTransportAvailability,
} from "../transports/service";

function generateQuoteNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000)
    .toString()
    .padStart(4, "0");
  return `SM-${year}${month}-${random}`;
}

type DraftItem = Omit<Prisma.QuoteItemCreateManyInput, "quoteId">;

/**
 * Crée un devis complet : validation, recalcul serveur, snapshot des prix.
 * Garantit : total = somme des lignes.
 */
export async function createQuote(input: CreateQuoteInput) {
  // 1. Validation des dates
  const dateValidation = validateDates(input.arrivalDate, input.departureDate);
  if (!dateValidation.valid) throw new Error(dateValidation.error);

  const nights = calculateNights(input.arrivalDate, input.departureDate);

  // 2. Chargement des objets depuis la base (source de vérité)
  const accommodation = input.accommodationId
    ? await getAccommodationById(input.accommodationId)
    : null;
  if (input.accommodationId && !accommodation) {
    throw new Error("Hébergement introuvable ou inactif.");
  }

  const excursions = await getExcursionsByIds(input.excursionIds ?? []);
  const transports = await getTransportsByIds(input.transportIds ?? []);

  // 3. Vérification des disponibilités des véhicules loués
  for (const t of transports) {
    if (t.transportType === "VEHICLE_RENTAL") {
      const avail = await checkTransportAvailability(
        t.id,
        input.arrivalDate,
        input.departureDate,
      );
      if (!avail.available) {
        throw new Error(`${t.name} : ${avail.reason}`);
      }
    }
  }

  // 4. Construction des lignes (snapshot des prix côté serveur)
  const draftItems: DraftItem[] = [];
  let total = 0;

  if (accommodation) {
    const acc = calculateAccommodationTotal(
      accommodation,
      input.arrivalDate,
      input.departureDate,
    );
    total += acc.total;
    draftItems.push({
      itemType: "ACCOMMODATION",
      accommodationId: accommodation.id,
      referenceId: accommodation.id,
      label: accommodation.name,
      description: `${accommodation.stars} étoiles · zone ${accommodation.zone}`,
      unitPrice: acc.averageRate,
      quantity: 1,
      numberOfNights: acc.nights,
      total: acc.total,
      metadata: {
        category: accommodation.category,
        zone: accommodation.zone,
        stars: accommodation.stars,
      },
    });
  }

  for (const e of excursions) {
    const qty = input.itemQuantities[e.id] ?? input.guests;
    const lineTotal = e.pricePerPerson * qty;
    total += lineTotal;
    draftItems.push({
      itemType: "EXCURSION",
      excursionId: e.id,
      referenceId: e.id,
      label: e.name,
      description: e.duration,
      unitPrice: e.pricePerPerson,
      quantity: qty,
      numberOfPeople: qty,
      total: lineTotal,
      metadata: {
        includesLunch: e.includesLunch,
        includesTransfer: e.includesTransfer,
      },
    });
  }

  for (const t of transports) {
    const defaultQty = t.unit === "DAY" ? Math.max(1, nights) : 1;
    const qty = input.itemQuantities[t.id] ?? defaultQty; // 👈 Override ou durée du séjour
    const lineTotal = t.price * qty;
    total += lineTotal;
    draftItems.push({
      itemType: "TRANSPORT",
      transportId: t.id,
      referenceId: t.id,
      label: t.name,
      description: t.withDriver ? "Avec chauffeur" : "Sans chauffeur",
      unitPrice: t.price,
      quantity: qty ?? defaultQty,
      total: lineTotal,
      metadata: {
        type: t.transportType,
        unit: t.unit,
        capacity: t.capacity,
      },
    });
  }

  // 5. Création atomique (devis + lignes)
  const quote = await prisma.$transaction(async (tx) => {
    const newQuote = await tx.quote.create({
      data: {
        quoteNumber: generateQuoteNumber(),
        status: "SUBMITTED",
        arrivalDate: new Date(input.arrivalDate),
        departureDate: new Date(input.departureDate),
        guests: input.guests,
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        clientWhatsapp: input.clientWhatsapp,
        notes: input.notes,
        total,
        currency: "MGA",
      },
    });

    if (draftItems.length > 0) {
      await tx.quoteItem.createMany({
        data: draftItems.map((d) => ({ ...d, quoteId: newQuote.id })),
      });
    }

    return tx.quote.findUniqueOrThrow({
      where: { id: newQuote.id },
      include: { items: true },
    });
  });

  return quote;
}

export async function getQuoteByToken(token: string) {
  return prisma.quote.findUnique({
    where: { token },
    include: {
      items: {
        include: { accommodation: true, excursion: true, transport: true },
      },
    },
  });
}

export async function updateQuoteStatus(
  quoteId: string,
  status:
    | "DRAFT"
    | "SUBMITTED"
    | "EMAIL_SENT"
    | "CONTACTED"
    | "CONFIRMED"
    | "CANCELLED"
    | "ARCHIVED",
) {
  return prisma.quote.update({
    where: { id: quoteId },
    data: { status },
  });
}

export async function getAllQuotes() {
  return prisma.quote.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}
