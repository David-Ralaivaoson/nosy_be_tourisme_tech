"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Check, Heart } from "lucide-react";
import type { Accommodation } from "@prisma/client";
import { cn } from "@/src/lib/utils";
import { useQuoteStore } from "@/src/store/quote-store";
import { formatMGA } from "@/src/lib/pricing";

const CATEGORY_LABELS: Record<string, string> = {
  HOTEL: "Hôtel",
  BUNGALOW: "Bungalow",
  VILLA: "Villa",
  ECOLODGE: "Écolodge",
  LUXE: "Luxe",
  GUEST_HOUSE: "Chambres d'hôtes",
};
const ZONE_LABELS: Record<string, string> = {
  NORTH: "Nord",
  SOUTH: "Sud",
  WEST: "Ouest",
  EAST: "Est",
  CENTER: "Centre",
};

export default function AccommodationCard({
  acc,
}: {
  acc: Accommodation & { images?: any[] };
}) {
  const { accommodationId, setAccommodation } = useQuoteStore();
  const selected = accommodationId === acc.id;

  const imageUrl =
    (acc as any).images?.[0]?.url ??
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm shadow-violet-900/5 transition-all duration-300 hover:-translate-y-1 hover:border-violet-100 hover:shadow-xl hover:shadow-violet-500/10">
      {/* Image */}
      <Link
        href={`/hebergements/${acc.slug}`}
        className="relative block h-52 overflow-hidden"
      >
        <Image
          src={imageUrl}
          alt={acc.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/5 to-transparent" />

        <div className="absolute left-3 top-3 flex gap-1.5">
          <span className="rounded-full bg-[#17123a]/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            {CATEGORY_LABELS[acc.category]}
          </span>
          {acc.isFeatured && (
            <span className="flex items-center gap-1 rounded-full bg-linear-to-r from-violet-600 to-indigo-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm shadow-violet-500/30">
              <Star className="size-2.5 fill-white" /> Top
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white px-2.5 py-1 shadow-sm">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-[#17123a]">
            {acc.rating?.toFixed(1) ?? "—"}
          </span>
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs font-semibold text-white">
          <MapPin className="size-3" />
          <span>{ZONE_LABELS[acc.zone]}</span>
        </div>
      </Link>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-1">
          {Array.from({ length: acc.stars }).map((_, i) => (
            <Star key={i} className="size-3 fill-violet-500 text-violet-500" />
          ))}
        </div>

        <Link
          href={`/hebergements/${acc.slug}`}
          className="mb-2 text-lg font-bold leading-tight text-[#17123a] transition-colors hover:text-violet-600"
        >
          {acc.name}
        </Link>

        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-[#17123a]/50">
          {acc.descriptionFr}
        </p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {acc.amenities.slice(0, 3).map((a) => (
            <span
              key={a}
              className="rounded-md bg-violet-50 px-2 py-0.5 text-[9px] font-medium text-violet-700"
            >
              {a}
            </span>
          ))}
          {acc.amenities.length > 3 && (
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-[#17123a]/40">
              +{acc.amenities.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div>
            <div className="text-xl font-black text-violet-600">
              {formatMGA(acc.pricePerNightLowSeason)}
            </div>
            <div className="text-[10px] font-medium uppercase tracking-wider text-[#17123a]/35">
              / nuit · basse saison
            </div>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setAccommodation(selected ? null : acc.id);
            }}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200",
              selected
                ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                : "bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25 hover:from-violet-500 hover:to-indigo-500",
            )}
          >
            {selected ? (
              <>
                <Check className="size-3.5" /> Ajouté
              </>
            ) : (
              <>
                <Heart className="size-3.5" /> Ajouter
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
