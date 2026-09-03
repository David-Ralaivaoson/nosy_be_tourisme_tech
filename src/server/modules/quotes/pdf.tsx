import "server-only";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import type { Quote, QuoteItem } from "@prisma/client";
import { addDays, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

// ─── Palette ─────────────────────────────────────────────────────────────
const VIOLET = "#7c3aed";
const VIOLET_DARK = "#5b21b6";
const VIOLET_LIGHT = "#f5f3ff";
const ZEBRA = "#faf9ff";
const INK = "#111827";
const GRAY = "#6b7280";
const GRAY_LIGHT = "#9ca3af";
const LINE = "#ede9fe";

function mga(n: number): string {
  const grouped = Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
  return `${grouped}\u00A0Ar`;
}

function fmtDate(d: Date | string | null | undefined): string {
  if (!d) return "—";
  try {
    return format(typeof d === "string" ? parseISO(d) : d, "dd MMM yyyy", {
      locale: fr,
    });
  } catch {
    return "—";
  }
}

const TYPE_LABEL: Record<string, string> = {
  ACCOMMODATION: "Hébergement",
  EXCURSION: "Excursion",
  TRANSPORT: "Transport",
};

function itemDetail(item: QuoteItem): string {
  if (item.numberOfNights)
    return `${item.numberOfNights} nuit${item.numberOfNights > 1 ? "s" : ""} × ${mga(item.unitPrice)}`;
  if (item.numberOfPeople)
    return `${item.numberOfPeople} pers. × ${mga(item.unitPrice)}`;
  if (item.quantity > 1)
    return `${item.quantity} jour${item.quantity > 1 ? "s" : ""} × ${mga(item.unitPrice)}`;
  const meta = (item.metadata ?? {}) as { unit?: string; type?: string };
  if (meta.unit === "TRIP" || meta.type === "TRANSFER")
    return "Prix par trajet";
  return mga(item.unitPrice);
}

// ─── Styles COMPACTS (garantit 1 page A4 même avec ~10 lignes) ──────────
const styles = StyleSheet.create({
  page: {
    padding: "26 30",
    fontSize: 9,
    color: INK,
    fontFamily: "Helvetica",
    lineHeight: 1.3,
    backgroundColor: "#ffffff",
  },

  /* ── En-tête ── */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  brandBlock: { flexDirection: "row", alignItems: "center" },
  logoBox: {
    width: 32,
    height: 32,
    borderRadius: 7,
    backgroundColor: VIOLET,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  logoText: { color: "#ffffff", fontSize: 12, fontWeight: 800 },
  brandName: {
    fontSize: 14,
    fontWeight: 800,
    color: VIOLET,
    letterSpacing: 0.6,
  },
  brandTag: { fontSize: 7, color: GRAY, marginTop: 1 },
  contactText: {
    fontSize: 7,
    color: GRAY,
    textAlign: "right",
    lineHeight: 1.5,
  },
  headerRule: {
    height: 1.5,
    backgroundColor: VIOLET,
    borderRadius: 1,
    marginBottom: 12,
  },

  /* ── Cartes méta ── */
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  metaCard: {
    width: "48.5%",
    backgroundColor: VIOLET_LIGHT,
    borderRadius: 5,
    padding: "6 9",
  },
  metaLabel: {
    fontSize: 6,
    fontWeight: 700,
    color: VIOLET_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 1.5,
  },
  metaValue: { fontSize: 9, fontWeight: 700, color: INK, lineHeight: 1.3 },
  metaValueBig: {
    fontSize: 11,
    fontWeight: 800,
    color: VIOLET,
    lineHeight: 1.2,
  },
  metaSub: { fontSize: 7, color: GRAY, marginTop: 0.5, lineHeight: 1.3 },

  /* ── Titre de section ── */
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  sectionBar: {
    width: 2.5,
    height: 10,
    backgroundColor: VIOLET,
    marginRight: 6,
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 800,
    color: VIOLET_DARK,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  /* ── Tableau ── */
  th: {
    flexDirection: "row",
    backgroundColor: VIOLET,
    borderRadius: 4,
    padding: "5 9",
    marginBottom: 2,
  },
  thText: {
    color: "#ffffff",
    fontSize: 6.5,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  colService: { width: "46%" },
  colDetail: { width: "30%" },
  colAmount: { width: "24%", textAlign: "right" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: "5 9",
    borderBottom: `1 solid ${LINE}`,
  },
  rowZebra: { backgroundColor: ZEBRA },
  typeLabel: {
    fontSize: 5.5,
    fontWeight: 700,
    color: VIOLET,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 0.5,
  },
  serviceName: { fontSize: 8.5, fontWeight: 700, color: INK, lineHeight: 1.2 },
  detailText: { fontSize: 7.5, color: GRAY, lineHeight: 1.3 },
  amountText: {
    fontSize: 8.5,
    fontWeight: 700,
    color: INK,
    textAlign: "right",
  },

  /* ── Total ── */
  totalBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: VIOLET,
    borderRadius: 5,
    padding: "8 12",
    marginTop: 10,
  },
  totalLabel: {
    color: "#ede9fe",
    fontSize: 8,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  totalValue: { color: "#ffffff", fontSize: 12.5, fontWeight: 800 },

  /* ── Note de clôture ── */
  notesBox: {
    marginTop: 10,
    backgroundColor: VIOLET_LIGHT,
    borderLeft: `2.5 solid ${VIOLET}`,
    borderRadius: 4,
    padding: "7 10",
  },
  notesTitle: {
    fontSize: 7.5,
    fontWeight: 800,
    color: VIOLET_DARK,
    marginBottom: 1.5,
  },
  notesText: { fontSize: 7, color: "#4b5563", lineHeight: 1.45 },

  /* ── Pied de page ── */
  footer: {
    position: "absolute",
    bottom: 14,
    left: 30,
    right: 30,
    paddingTop: 5,
    borderTop: "1 solid #e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: { fontSize: 6, color: GRAY_LIGHT },
});

// ─── Document ────────────────────────────────────────────────────────────
export function QuotePdfDocument({
  quote,
}: {
  quote: Quote & { items: QuoteItem[] };
}) {
  const nights =
    quote.arrivalDate && quote.departureDate
      ? Math.max(
          0,
          Math.round(
            (quote.departureDate.getTime() - quote.arrivalDate.getTime()) /
              86_400_000,
          ),
        )
      : 0;

  return (
    <Document title={`Devis ${quote.quoteNumber}`} author="Sainte-Marie Travel">
      <Page size="A4" style={styles.page}>
        {/* ── En-tête (wrap=false → jamais coupé) ── */}
        <View style={styles.headerRow} wrap={false}>
          <View style={styles.brandBlock}>
            <View style={styles.logoBox}>
              <Text style={styles.logoText}>SM</Text>
            </View>
            <View>
              <Text style={styles.brandName}>SAINTE-MARIE TRAVEL</Text>
              <Text style={styles.brandTag}>
                Agence locale – Voyages sur mesure
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.contactText}>WhatsApp : +261 32 80 300 46</Text>
            <Text style={styles.contactText}>
              Ambodifotatra, Île Sainte-Marie – Madagascar
            </Text>
            <Text style={styles.contactText}>
              contact@sainte-marie-travel.mg
            </Text>
          </View>
        </View>
        <View style={styles.headerRule} />

        {/* ── Cartes méta (wrap=false → bloc indivisible) ── */}
        <View wrap={false}>
          <View style={styles.metaRow}>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>Devis N°</Text>
              <Text style={styles.metaValue}>{quote.quoteNumber}</Text>
              <Text style={styles.metaSub}>
                Émis le {fmtDate(quote.createdAt)}
              </Text>
              <Text style={styles.metaSub}>
                Valable jusqu'au {fmtDate(addDays(quote.createdAt, 14))}
              </Text>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>Séjour</Text>
              <Text style={styles.metaValue}>
                {fmtDate(quote.arrivalDate)} – {fmtDate(quote.departureDate)}
              </Text>
              <Text style={styles.metaSub}>
                {nights} nuit{nights > 1 ? "s" : ""} · {quote.guests} voyageur
                {quote.guests > 1 ? "s" : ""}
              </Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>Client</Text>
              <Text style={styles.metaValue}>{quote.clientName}</Text>
              <Text style={styles.metaSub}>{quote.clientEmail}</Text>
              <Text style={styles.metaSub}>{quote.clientWhatsapp}</Text>
            </View>
            <View style={styles.metaCard}>
              <Text style={styles.metaLabel}>Montant total</Text>
              <Text style={styles.metaValueBig}>{mga(quote.total)}</Text>
              <Text style={styles.metaSub}>Prix nets en Ariary (MGA)</Text>
            </View>
          </View>
        </View>

        {/* ── Tableau des prestations ── */}
        <View style={styles.sectionHead} wrap={false}>
          <View style={styles.sectionBar} />
          <Text style={styles.sectionTitle}>Récapitulatif des prestations</Text>
        </View>

        <View style={styles.th} wrap={false}>
          <Text style={[styles.thText, styles.colService]}>Service</Text>
          <Text style={[styles.thText, styles.colDetail]}>Détail</Text>
          <Text style={[styles.thText, styles.colAmount]}>Montant</Text>
        </View>

        {quote.items.map((item, i) => (
          <View
            key={item.id}
            style={[styles.row, i % 2 === 1 ? styles.rowZebra : undefined]}
            wrap={false}
          >
            <View style={styles.colService}>
              <Text style={styles.typeLabel}>{TYPE_LABEL[item.itemType]}</Text>
              <Text style={styles.serviceName}>{item.label}</Text>
            </View>
            <View style={styles.colDetail}>
              <Text style={styles.detailText}>{itemDetail(item)}</Text>
            </View>
            <View style={styles.colAmount}>
              <Text style={styles.amountText}>{mga(item.total)}</Text>
            </View>
          </View>
        ))}

        {/* ── Total (wrap=false → collé à la dernière ligne) ── */}
        <View style={styles.totalBar} wrap={false}>
          <Text style={styles.totalLabel}>Total général</Text>
          <Text style={styles.totalValue}>{mga(quote.total)}</Text>
        </View>

        {/* ── Note de clôture ── */}
        <View style={styles.notesBox} wrap={false}>
          <Text style={styles.notesTitle}>Confirmation de réservation</Text>
          <Text style={styles.notesText}>
            Pour confirmer, contactez-nous sur WhatsApp au +261 32 80 300 46 en
            mentionnant votre numéro de devis. Tarifs indicatifs susceptibles
            d'ajustement selon disponibilité. Devis valable 14 jours.
          </Text>
        </View>

        {/* ── Pied de page ── */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Sainte-Marie Travel – Ambodifotatra, Île Sainte-Marie, Madagascar
          </Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );
}

/**
 * Génère le PDF du devis (Buffer normalisé)
 */
export async function generateQuotePdfBuffer(
  quote: Quote & { items: QuoteItem[] },
): Promise<Buffer> {
  const result: unknown = await pdf(
    <QuotePdfDocument quote={quote} />,
  ).toBuffer();

  if (Buffer.isBuffer(result)) return result;

  if (result instanceof ReadableStream) {
    const arrayBuffer = await new Response(result).arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of result as AsyncIterable<Uint8Array | string>) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
