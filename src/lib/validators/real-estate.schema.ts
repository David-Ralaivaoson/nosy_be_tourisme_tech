import { z } from "zod";

export const terrainFiltersSchema = z.object({
  minSurface: z.number().int().min(0).optional(),
  maxSurface: z.number().int().min(0).optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().min(0).optional(),
  statut: z.enum(["TITRE_BORNE", "BORNE", "EN_COURS"]).optional(),
  vueMer: z.boolean().optional(),
  eau: z.boolean().optional(),
  electricite: z.boolean().optional(),
  exclusivite: z.boolean().optional(),
});

export type TerrainFilters = z.infer<typeof terrainFiltersSchema>;

/**
 * Schéma pour une demande d'information sur un terrain
 */
export const realEstateInquirySchema = z.object({
  terrainId: z.string().min(1, "Terrain requis"),
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  message: z.string().optional(),
});

export type RealEstateInquiryInput = z.infer<typeof realEstateInquirySchema>;
