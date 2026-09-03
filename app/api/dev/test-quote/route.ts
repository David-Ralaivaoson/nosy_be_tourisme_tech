import { NextResponse } from "next/server";
import { prisma } from "@/src/server/db/client";
import { createQuote } from "@/src/server/modules/quotes/service";

export const dynamic = "force-dynamic";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const accommodation = await prisma.accommodation.findFirst({
      where: { isActive: true },
    });
    const excursion = await prisma.excursion.findFirst({
      where: { isActive: true },
    });
    const transport = await prisma.transportOption.findFirst({
      where: { isActive: true },
    });

    const quote = await createQuote({
      clientName: "Client Test",
      clientEmail: "test@sainte-marie.mg",
      clientWhatsapp: "+261 32 80 300 46",
      arrivalDate: "2026-10-01",
      departureDate: "2026-10-07",
      guests: 2,
      accommodationId: accommodation?.id ?? null,
      excursionIds: excursion ? [excursion.id] : [],
      transportIds: transport ? [transport.id] : [],
      serviceIds: [], // ← AJOUTÉ
      itemQuantities: {}, // ← AJOUTÉ
      notes: "Test API route",
    });

    return NextResponse.json({
      ok: true,
      quoteNumber: quote.quoteNumber,
      total: quote.total,
      items: quote.items.map((i) => ({
        label: i.label,
        total: i.total,
      })),
      sumCheck: quote.items.reduce((s, i) => s + i.total, 0) === quote.total,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: String(error) },
      { status: 500 },
    );
  }
}
