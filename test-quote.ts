import { prisma } from "./src/server/db/client";
import { createQuote } from "./src/server/modules/quotes/service";

async function main() {
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
    notes: "Test étape 4",
  });

  console.log("📋 Devis:", quote.quoteNumber);
  console.log("💰 Total:", quote.total);
  for (const item of quote.items) {
    console.log(`   - ${item.label} → ${item.total}`);
  }
  const sum = quote.items.reduce((s, i) => s + i.total, 0);
  console.log(
    sum === quote.total
      ? "✅ Total cohérent avec les lignes"
      : `❌ Incohérent : somme=${sum} total=${quote.total}`,
  );
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
