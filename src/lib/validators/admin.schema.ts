import { z } from "zod";

export const adminAccommodationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nom requis"),
  slug: z.string().min(2, "Slug requis"),
  category: z.enum([
    "HOTEL",
    "BUNGALOW",
    "VILLA",
    "ECOLODGE",
    "LUXE",
    "GUEST_HOUSE",
  ]),
  zone: z.enum(["NORTH", "SOUTH", "WEST", "EAST", "CENTER"]),
  descriptionFr: z.string().optional().default(""),
  pricePerNightLowSeason: z.coerce.number().int().min(0, "Prix invalide"),
  pricePerNightHighSeason: z.coerce.number().int().min(0, "Prix invalide"),
  capacity: z.coerce.number().int().min(1).default(2),
  stars: z.coerce.number().int().min(1).max(5).default(3),
  amenities: z.string().optional().default(""),
});

export const adminExcursionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nom requis"),
  slug: z.string().min(2, "Slug requis"),
  descriptionFr: z.string().optional().default(""),
  pricePerPerson: z.coerce.number().int().min(0, "Prix invalide"),
  duration: z.string().min(1, "Durée requise"),
});

export const adminTransportSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Nom requis"),
  slug: z.string().min(2, "Slug requis"),
  transportType: z.enum(["TRANSFER", "VEHICLE_RENTAL"]),
  price: z.coerce.number().int().min(0, "Prix invalide"),
  unit: z.enum(["TRIP", "DAY"]),
  capacity: z.coerce.number().int().min(0).optional(),
  descriptionFr: z.string().optional().default(""),
});

export type ActionResult = { ok: boolean; error?: string } | null;
