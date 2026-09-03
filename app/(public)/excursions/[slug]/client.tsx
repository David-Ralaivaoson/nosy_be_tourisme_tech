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
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">
      {/* Back button */}
      <Link
        href="/excursions"
        className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-violet-400"
      >
        <ArrowLeft className="size-4" />
        Retour aux excursions
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_400px]">
        {/* Left column */}
        <div>
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="relative h-96 overflow-hidden rounded-2xl">
              <img
                src={imageUrl}
                alt={excursion.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="mb-4 text-4xl font-light md:text-5xl">
              {excursion.name}
            </h1>

            <div className="mb-6 flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 text-sm">
                <Clock className="size-4 text-violet-400" />
                {excursion.duration}
              </span>
              {excursion.includesLunch && (
                <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-300">
                  <Utensils className="size-4" /> Déjeuner inclus
                </span>
              )}
              {excursion.includesTransfer && (
                <span className="flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1.5 text-sm text-blue-300">
                  <CarFront className="size-4" /> Transfert inclus
                </span>
              )}
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-base leading-relaxed text-white/70">
                {excursion.descriptionFr}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Right column - Pricing & action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:sticky lg:top-24"
        >
          <div className="rounded-2xl border border-violet-500/20 bg-[#0f0f10] p-6">
            <h3 className="mb-2 text-lg font-bold">Tarification</h3>
            <div className="mb-6">
              <div className="text-3xl font-bold text-violet-400">
                {formatMGA(excursion.pricePerPerson)}
              </div>
              <div className="text-xs text-white/40">par personne</div>
            </div>

            <div className="mb-6 rounded-lg bg-violet-500/10 p-4 text-sm text-violet-200">
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
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500",
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
