import "server-only";

import { Resend } from "resend";
import type { Quote, QuoteItem } from "@prisma/client";
import { formatMGA } from "@/src/lib/pricing";

const resend = new Resend(process.env.RESEND_API_KEY);

export function quoteEmailSubject(quote: Quote): string {
  return `Votre projet de voyage à Sainte-Marie - Devis N°${quote.quoteNumber}`;
}

function buildQuoteEmailHtml(quote: Quote & { items: QuoteItem[] }): string {
  const rows = quote.items
    .map(
      (i) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:600;color:#1f2937;">${i.label}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;color:#1f2937;">${formatMGA(i.total)}</td>
      </tr>`,
    )
    .join("");

  const wa = encodeURIComponent(
    `Bonjour, je suis ${quote.clientName}. Je souhaite confirmer mon devis ${quote.quoteNumber} (${formatMGA(quote.total)}) pour Sainte-Marie.`,
  );

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #eee;">
    <div style="background:#7c3aed;padding:24px;text-align:center;">
      <div style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:2px;">SAINTE-MARIE TRAVEL</div>
      <div style="color:#ddd6fe;font-size:12px;margin-top:4px;">Votre devis de voyage est prêt</div>
    </div>
    <div style="padding:28px;">
      <p style="color:#1f2937;font-size:15px;">Bonjour <strong>${quote.clientName}</strong>,</p>
      <p style="color:#4b5563;font-size:14px;line-height:1.6;">
        Merci pour votre demande ! Voici le récapitulatif de votre projet de voyage
        à Sainte-Marie (devis <strong>${quote.quoteNumber}</strong>).
        Le détail complet se trouve dans le PDF ci-joint.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px;">
        <thead>
          <tr style="background:#f5f3ff;">
            <th style="padding:10px 12px;text-align:left;color:#7c3aed;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Prestation</th>
            <th style="padding:10px 12px;text-align:right;color:#7c3aed;text-transform:uppercase;font-size:11px;letter-spacing:1px;">Montant</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td style="padding:12px;font-weight:800;color:#7c3aed;text-transform:uppercase;font-size:12px;">Total général</td>
            <td style="padding:12px;text-align:right;font-weight:800;color:#7c3aed;font-size:16px;">${formatMGA(quote.total)}</td>
          </tr>
        </tfoot>
      </table>
      <div style="text-align:center;margin:28px 0;">
        <a href="https://wa.me/261328030046?text=${wa}"
           style="background:#25D366;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:10px;font-weight:700;font-size:14px;display:inline-block;">
          Confirmer sur WhatsApp
        </a>
      </div>
      <p style="color:#9ca3af;font-size:11px;line-height:1.5;">
        Sainte-Marie Travel - Ambodifotatra, Ile Sainte-Marie, Madagascar<br/>
        WhatsApp : +261 32 80 300 46 - contact@sainte-marie-travel.mg
      </p>
    </div>
  </div>`;
}

/**
 * Envoie l'email de devis avec PDF via Resend.
 *
 * ⚠️ DEV sans domaine vérifié :
 *   - from = onboarding@resend.dev (imposé par Resend)
 *   - to = UNIQUEMENT l'email du compte Resend
 */
export async function sendQuoteEmail(params: {
  quote: Quote & { items: QuoteItem[] };
  pdfBuffer: Buffer;
}): Promise<{ providerId: string }> {
  const { quote, pdfBuffer } = params;

  const from = process.env.EMAIL_FROM || "onboarding@resend.dev";

  // ⚠️ En dev sans domaine vérifié : Resend n'autorise l'envoi qu'à l'email
  // du compte Resend. On redirige automatiquement l'envoi vers cet email.
  const devRedirect = process.env.RESEND_DEV_TO;
  const isDev = process.env.NODE_ENV === "development";
  const toEmail = isDev && devRedirect ? devRedirect : quote.clientEmail;

  console.log(
    `[EMAIL] Resend → from=${from} to=${toEmail}${toEmail !== quote.clientEmail ? ` (redirigé depuis ${quote.clientEmail})` : ""}`,
  );

  const result = await resend.emails.send({
    from,
    to: [toEmail],
    subject: quoteEmailSubject(quote),
    html: buildQuoteEmailHtml(quote),
    attachments: [
      {
        filename: `devis-${quote.quoteNumber}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  if (result.error) {
    console.error("[EMAIL] Resend ERROR:", result.error);
    throw new Error(`Resend: ${result.error.message}`);
  }

  console.log(`[EMAIL] Resend OK id=${result.data?.id}`);
  return { providerId: result.data?.id ?? "" };
}
