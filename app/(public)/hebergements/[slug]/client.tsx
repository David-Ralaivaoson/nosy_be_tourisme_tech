"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Check, Plus } from "lucide-react";
import type { Accommodation, AccommodationImage } from "@prisma/client";
import { useQuoteStore } from "@/src/store/quote-store";
import { formatMGA } from "@/src/lib/pricing";
import { cn } from "@/src/lib/utils";

const CATEGORY_LABELS: Record<string, string> = {
  HOTEL: "Hôtel",
  BUNGALOW: "Bungalow",
  VILLA: "Villa",
  ECOLODGE: "Écolodge",
  LUXE: "Luxe",
  GUEST_HOUSE: "Chambres d'hôtes",
};

export default function AccommodationDetailsClient({
  accommodation,
}: {
  accommodation: Accommodation & { images?: AccommodationImage[] };
}) {
  const { accommodationId, setAccommodation } = useQuoteStore();
  const selected = accommodationId === accommodation.id;

  const images = accommodation.images ?? [];
  const primaryImage =
    images.find((i) => i.isPrimary)?.url ??
    images[0]?.url ??
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <Link
        href="/hebergements"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#17123a]/55 transition hover:text-violet-600"
      >
        <ArrowLeft className="size-4" />
        Retour aux hébergements
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
        {/* Colonne gauche */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative mb-4 h-96 overflow-hidden rounded-3xl border border-slate-200 shadow-lg shadow-violet-900/10">
              <Image
                src={primaryImage}
                alt={accommodation.name}
                fill
                className="object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((img, i) => (
                  <div
                    key={i}
                    className="relative h-24 overflow-hidden rounded-xl border border-slate-200"
                  >
                    <Image
                      src={img.url}
                      alt={`${accommodation.name} ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="mb-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-violet-700">
                {CATEGORY_LABELS[accommodation.category]}
              </span>
              {accommodation.isFeatured && (
                <span className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  ★ Top
                </span>
              )}
            </div>

            <h1 className="mb-4 text-4xl font-black tracking-tight text-[#17123a] md:text-5xl">
              {accommodation.name}
            </h1>

            <div className="mb-6 flex flex-wrap gap-4 text-sm text-[#17123a]/60">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-violet-600" />
                {accommodation.zone}
              </span>
              <span className="flex items-center gap-1.5">
                {Array.from({ length: accommodation.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-3 fill-violet-500 text-violet-500"
                  />
                ))}
              </span>
              {accommodation.rating && (
                <span className="flex items-center gap-1.5">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  {accommodation.rating.toFixed(1)}
                </span>
              )}
            </div>

            <p className="mb-8 max-w-2xl text-base leading-relaxed text-[#17123a]/60">
              {accommodation.descriptionFr}
            </p>

            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold text-[#17123a]">
                Équipements
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {accommodation.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <Check className="size-4 text-emerald-500" />
                    <span className="text-sm text-[#17123a]/70">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Colonne droite */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:sticky lg:top-28"
        >
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-violet-900/5">
            <h3 className="mb-2 text-lg font-bold text-[#17123a]">Tarifs</h3>
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-sm text-[#17123a]/60">Basse saison</span>
                <span className="text-lg font-bold text-violet-600">
                  {formatMGA(accommodation.pricePerNightLowSeason)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#17123a]/60">Haute saison</span>
                <span className="text-lg font-bold text-violet-600">
                  {formatMGA(accommodation.pricePerNightHighSeason)}
                </span>
              </div>
            </div>

            <div className="mb-6 text-xs text-[#17123a]/40">
              Capacité : {accommodation.capacity} personne
              {accommodation.capacity > 1 ? "s" : ""}
            </div>

            <button
              onClick={() =>
                setAccommodation(selected ? null : accommodation.id)
              }
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold uppercase tracking-widest transition",
                selected
                  ? "bg-emerald-500 text-white"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700",
              )}
            >
              {selected ? (
                <>
                  <Check className="size-4" /> Ajouté au devis
                </>
              ) : (
                <>
                  <Plus className="size-4" /> Ajouter au devis
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
