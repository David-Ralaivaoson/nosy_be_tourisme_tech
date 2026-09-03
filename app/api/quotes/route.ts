import { NextResponse } from "next/server";
import { createQuoteSchema } from "@/src/lib/validators/quote.schema";
import {
  createQuote,
  updateQuoteStatus,
} from "@/src/server/modules/quotes/service";
import { generateQuotePdfBuffer } from "@/src/server/modules/quotes/pdf";
import {
  sendQuoteEmail,
  quoteEmailSubject,
} from "@/src/server/modules/emails/resend";
import { logEmail } from "@/src/server/modules/emails/service";
import { prisma } from "@/src/server/db/client";
import { calculateNights } from "@/src/lib/pricing";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  if (!body) {
    return NextResponse.json(
      { ok: false, error: "Corps de requête invalide." },
      { status: 400 },
    );
  }

  const parsed = createQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "Données invalides.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  try {
    console.log("[QUOTE] Création du devis...");
    const quote = await createQuote(parsed.data);
    console.log(`[QUOTE] Devis créé: ${quote.quoteNumber}`);

    // ─── Services additionnels ─────────────────────────────────────────
    const serviceIds = parsed.data.serviceIds;
    if (serviceIds.length > 0) {
      const services = await prisma.additionalService.findMany({
        where: { id: { in: serviceIds }, isActive: true },
      });

      const nights = calculateNights(
        parsed.data.arrivalDate,
        parsed.data.departureDate,
      );

      let additionalServicesTotal = 0;

      for (const service of services) {
        let defaultQty = 1;
        let numberOfPeople: number | null = null;

        if (service.unit === "PERSON") defaultQty = parsed.data.guests;
        else if (service.unit === "DAY" && nights > 0) defaultQty = nights;

        const qty = parsed.data.itemQuantities?.[service.id] ?? defaultQty; // 👈 Override

        const lineTotal = service.price * qty;
        additionalServicesTotal += lineTotal;

        await prisma.quoteItem.create({
          data: {
            quoteId: quote.id,
            itemType: "ADDITIONAL_SERVICE",
            additionalServiceId: service.id,
            label: service.name,
            description: service.description,
            unitPrice: service.price,
            quantity: qty,
            numberOfPeople,
            total: lineTotal,
            metadata: { unit: service.unit, icon: service.icon },
          },
        });
      }

      // Mise à jour du total du devis
      if (additionalServicesTotal > 0) {
        await prisma.quote.update({
          where: { id: quote.id },
          data: { total: { increment: additionalServicesTotal } },
        });
      }

      console.log(
        `[QUOTE] ${services.length} service(s) ajouté(s) — +${additionalServicesTotal} Ar`,
      );
    }

    // ─── Re-fetch avec items (inclut hébergement, excursions, transports + services)
    const quoteWithItems = await prisma.quote.findUnique({
      where: { id: quote.id },
      include: { items: true },
    });

    if (!quoteWithItems) {
      throw new Error("Devis introuvable après création");
    }

    // ─── Email + PDF ───────────────────────────────────────────────────
    let emailSent = false;
    const subject = quoteEmailSubject(quoteWithItems);

    try {
      console.log("[QUOTE] Génération PDF...");
      const pdfBuffer = await generateQuotePdfBuffer(quoteWithItems);
      console.log(`[QUOTE] PDF généré: ${pdfBuffer.length} bytes`);

      console.log("[QUOTE] Envoi email via Resend...");
      const { providerId } = await sendQuoteEmail({
        quote: quoteWithItems,
        pdfBuffer,
      });

      await logEmail({
        quoteId: quoteWithItems.id,
        to: quoteWithItems.clientEmail,
        subject,
        status: "SENT",
        provider: "resend",
        providerId,
      });

      await updateQuoteStatus(quoteWithItems.id, "EMAIL_SENT");
      emailSent = true;
      console.log(`[QUOTE] ✅ Email envoyé !`);
    } catch (emailError) {
      console.error("[QUOTE] ❌ Erreur email:", emailError);
      await logEmail({
        quoteId: quoteWithItems.id,
        to: quoteWithItems.clientEmail,
        subject,
        status: "FAILED",
        provider: "resend",
        errorMessage:
          emailError instanceof Error ? emailError.message : String(emailError),
      });
    }

    return NextResponse.json({
      ok: true,
      quoteNumber: quoteWithItems.quoteNumber,
      token: quoteWithItems.token,
      total: quoteWithItems.total,
      emailSent,
    });
  } catch (e) {
    console.error("[QUOTE] Erreur:", e);
    const message =
      e instanceof Error ? e.message : "Erreur serveur inattendue.";
    return NextResponse.json({ ok: false, error: message }, { status: 422 });
  }
}
