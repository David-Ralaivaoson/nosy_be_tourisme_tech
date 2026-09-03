"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Check, Plus, Utensils, CarFront } from "lucide-react";
import type { Excursion } from "@prisma/client";
import { cn } from "@/src/lib/utils";
import { useQuoteStore } from "@/src/store/quote-store";
import { formatMGA } from "@/src/lib/pricing";

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
const GENERIC_IMAGE =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80";

export default function ExcursionCard({
  exc,
}: {
  exc: Excursion & { images?: { url: string }[] };
}) {
  const { excursionIds, toggleExcursion, guests } = useQuoteStore();
  const selected = excursionIds.includes(exc.id);
  const [imgSrc, setImgSrc] = useState(
    exc.images?.[0]?.url ?? FALLBACK_IMAGES[exc.slug] ?? GENERIC_IMAGE,
  );

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-violet-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-900/10">
      <Link
        href={`/excursions/${exc.slug}`}
        className="relative block h-52 overflow-hidden"
      >
        <img
          src={imgSrc}
          alt={exc.name}
          loading="lazy"
          onError={() => setImgSrc(GENERIC_IMAGE)}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#17123a]/80 shadow-sm backdrop-blur-sm">
          <Clock className="size-3 text-violet-600" />
          {exc.duration}
        </div>
        <div className="absolute right-3 top-3 flex gap-1.5">
          {exc.includesLunch && (
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              <Utensils className="size-3" /> Déjeuner
            </span>
          )}
          {exc.includesTransfer && (
            <span className="flex items-center gap-1 rounded-full bg-blue-500/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              <CarFront className="size-3" /> Transfert
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link
          href={`/excursions/${exc.slug}`}
          className="mb-2 text-lg font-semibold leading-tight text-[#17123a] transition-colors hover:text-violet-600"
        >
          {exc.name}
        </Link>
        <p className="mb-4 line-clamp-3 text-sm text-[#17123a]/55">
          {exc.descriptionFr}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <div className="text-xl font-bold text-violet-600">
              {formatMGA(exc.pricePerPerson)}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-[#17123a]/40">
              / personne · × {guests} pers.
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleExcursion(exc.id);
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition",
              selected
                ? "bg-emerald-500 text-white"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700",
            )}
          >
            {selected ? (
              <>
                <Check className="size-3.5" /> Ajouté
              </>
            ) : (
              <>
                <Plus className="size-3.5" /> Ajouter
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
