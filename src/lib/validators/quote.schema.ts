import { z } from "zod";

/**
 * Schéma de validation pour la création d'un devis.
 *
 * Cohérent avec :
 * - src/store/quote-store.ts   (arrivalDate, departureDate, guests, accommodationId,
 *                               excursionIds, transportIds, serviceIds)
 * - src/components/devis/LeadForm.tsx (payload envoyé)
 * - app/api/quotes/route.ts    (parsed.data.serviceIds typé, sans cast)
 * - src/server/modules/quotes/service.ts (validateDates)
 */
export const createQuoteSchema = z
  .object({
    // ── Coordonnées client ─────────────────────────────────────
    clientName: z
      .string()
      .trim()
      .min(2, "Le nom doit contenir au moins 2 caractères"),
    clientEmail: z.string().trim().email("Email invalide"),
    clientWhatsapp: z.string().trim().min(8, "Numéro WhatsApp invalide"),

    // ── Séjour ─────────────────────────────────────────────────
    arrivalDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date d'arrivée invalide (AAAA-MM-JJ)"),
    departureDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date de départ invalide (AAAA-MM-JJ)"),
    guests: z.coerce
      .number()
      .int()
      .min(1, "Au moins 1 voyageur")
      .max(20, "Maximum 20 voyageurs"),

    // ── Prestations sélectionnées (store Zustand) ──────────────
    accommodationId: z.string().nullable().optional(),
    excursionIds: z.array(z.string()).default([]),
    transportIds: z.array(z.string()).default([]),
    serviceIds: z.array(z.string()).default([]),

    // ── Divers ─────────────────────────────────────────────────
    notes: z.string().trim().optional(),
    itemQuantities: z.record(z.string(), z.number().int().min(1)).default({}),
  })
  // Départ strictement après l'arrivée (comparaison ISO fiable)
  .refine((d) => d.departureDate > d.arrivalDate, {
    message: "La date de départ doit être après la date d'arrivée",
    path: ["departureDate"],
  })
  // Durée maximale cohérente avec validateDates() du service
  .refine(
    (d) => {
      const nights = Math.round(
        (new Date(d.departureDate).getTime() -
          new Date(d.arrivalDate).getTime()) /
          86_400_000,
      );
      return nights <= 90;
    },
    {
      message: "Durée maximale du séjour : 90 nuits",
      path: ["departureDate"],
    },
  );

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;

/**
 * Schéma pour le téléchargement de PDF (vérification du token)
 */
export const downloadQuoteSchema = z.object({
  token: z.string().min(10, "Token invalide"),
});

export type DownloadQuoteInput = z.infer<typeof downloadQuoteSchema>;
