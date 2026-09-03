import { z } from "zod";

export const excursionFiltersSchema = z.object({
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().min(0).optional(),
  includesLunch: z.boolean().optional(),
  includesTransfer: z.boolean().optional(),
  search: z.string().optional(),
});

export type ExcursionFilters = z.infer<typeof excursionFiltersSchema>;
