import { NextResponse } from "next/server";
import { getQuoteByToken } from "@/src/server/modules/quotes/service";
import { generateQuotePdfBuffer } from "@/src/server/modules/quotes/pdf";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;

  const quote = await getQuoteByToken(token);
  if (!quote) {
    return NextResponse.json({ error: "Devis introuvable." }, { status: 404 });
  }

  try {
    const buffer = await generateQuotePdfBuffer(quote);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="devis-${quote.quoteNumber}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (e) {
    console.error("PDF_ERROR", e);
    return NextResponse.json(
      { error: "Erreur de génération du PDF." },
      { status: 500 },
    );
  }
}
