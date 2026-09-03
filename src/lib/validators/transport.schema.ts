import { z } from "zod";

export const transportFiltersSchema = z.object({
  type: z.enum(["TRANSFER", "VEHICLE_RENTAL"]).optional(),
  unit: z.enum(["TRIP", "DAY"]).optional(),
  withDriver: z.boolean().optional(),
  minCapacity: z.number().int().min(1).optional(),
});

export type TransportFilters = z.infer<typeof transportFiltersSchema>;
