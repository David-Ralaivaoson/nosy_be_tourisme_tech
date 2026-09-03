import { z } from "zod";

export const accommodationFiltersSchema = z.object({
  category: z
    .enum(["HOTEL", "BUNGALOW", "VILLA", "ECOLODGE", "LUXE", "GUEST_HOUSE"])
    .optional(),
  zone: z.enum(["NORTH", "SOUTH", "WEST", "EAST", "CENTER"]).optional(),
  minPrice: z.number().int().min(0).optional(),
  maxPrice: z.number().int().min(0).optional(),
  stars: z.number().int().min(1).max(5).optional(),
  amenities: z.array(z.string()).optional(),
  search: z.string().optional(),
});

export type AccommodationFilters = z.infer<typeof accommodationFiltersSchema>;
