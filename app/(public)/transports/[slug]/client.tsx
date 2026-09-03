"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Check,
  Plus,
  Utensils,
  CarFront,
} from "lucide-react";
import type { Excursion } from "@prisma/client";
import { useQuoteStore } from "@/src/store/quote-store";
import { formatMGA } from "@/src/lib/pricing";
import { cn } from "@/src/lib/utils";

const FALLBACK_IMAGES: Record<string, string> = {
  "safari-baleines":
    "https://images.unsplash.com/photo-1517783999520-f068d7431a60?w=800&q=80",
  "baie-ampanihy":
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
  "ile-aux-nattes":
    "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80",
  "piscines-naturelles":
    "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
  "maison-blanche":
    "https://images.unsplash.com/photo-1528127269322-539801943592?w=800&q=80",
  "plongee-sous-marine":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
};

export default function ExcursionDetailsClient({
  excursion,
}: {
  excursion: Excursion;
}) {
  const { excursionIds, toggleExcursion, guests } = useQuoteStore();
  const selected = excursionIds.includes(excursion.id);

  const imageUrl =
    FALLBACK_IMAGES[excursion.slug] ??
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <Link
        href="/excursions"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#17123a]/55 transition hover:text-violet-600"
      >
        <ArrowLeft className="size-4" />
        Retour aux excursions
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
            <div className="relative h-96 overflow-hidden rounded-3xl border border-slate-200 shadow-lg shadow-violet-900/10">
              <img
                src={imageUrl}
                alt={excursion.name}
                className="h-full w-full object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="mb-4 text-4xl font-black tracking-tight text-[#17123a] md:text-5xl">
              {excursion.name}
            </h1>

            <div className="mb-6 flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-[#17123a]/70 shadow-sm">
                <Clock className="size-4 text-violet-600" />
                {excursion.duration}
              </span>
              {excursion.includesLunch && (
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                  <Utensils className="size-4" /> Déjeuner inclus
                </span>
              )}
              {excursion.includesTransfer && (
                <span className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                  <CarFront className="size-4" /> Transfert inclus
                </span>
              )}
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-[#17123a]/60">
              {excursion.descriptionFr}
            </p>
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
            <h3 className="mb-2 text-lg font-bold text-[#17123a]">
              Tarification
            </h3>
            <div className="mb-6">
              <div className="text-3xl font-black text-violet-600">
                {formatMGA(excursion.pricePerPerson)}
              </div>
              <div className="text-xs text-[#17123a]/40">par personne</div>
            </div>

            <div className="mb-6 rounded-xl bg-violet-50 p-4 text-sm text-violet-700">
              Pour {guests} personne{guests > 1 ? "s" : ""} :{" "}
              <span className="font-bold">
                {formatMGA(excursion.pricePerPerson * guests)}
              </span>
            </div>

            <button
              onClick={() => toggleExcursion(excursion.id)}
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
