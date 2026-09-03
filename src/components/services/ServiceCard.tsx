"use client";

import {
  Shield,
  UserCheck,
  Camera,
  Plane,
  Video,
  Waves,
  Utensils,
  Sparkles,
  Check,
  Plus,
} from "lucide-react";
import type { AdditionalService } from "@prisma/client";
import { useQuoteStore } from "@/src/store/quote-store";
import { formatMGA } from "@/src/lib/pricing";
import { cn } from "@/src/lib/utils";

const ICONS: Record<string, any> = {
  Shield,
  UserCheck,
  Camera,
  Plane,
  Video,
  Waves,
  Utensils,
  Sparkles,
};

const UNIT_LABELS: Record<string, string> = {
  PERSON: "/ personne",
  DAY: "/ jour",
  FLAT: "Forfait",
};

export default function ServiceCard({
  service,
}: {
  service: AdditionalService;
}) {
  const { serviceIds, toggleService, guests, arrivalDate, departureDate } =
    useQuoteStore();
  const selected = serviceIds.includes(service.id);
  const Icon = ICONS[service.icon ?? "Sparkles"] ?? Sparkles;

  // Calcul du nombre de jours pour les services DAY
  const nights =
    arrivalDate && departureDate
      ? Math.max(
          0,
          Math.round(
            (new Date(departureDate).getTime() -
              new Date(arrivalDate).getTime()) /
              86_400_000,
          ),
        )
      : 0;

  const displayPrice =
    service.unit === "PERSON"
      ? formatMGA(service.price * guests)
      : service.unit === "DAY" && nights > 0
        ? formatMGA(service.price * nights)
        : formatMGA(service.price);

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border bg-white p-6 transition-all duration-300",
        selected
          ? "border-emerald-500/40 shadow-lg shadow-emerald-500/10"
          : "border-zinc-200 hover:border-violet-500/30 hover:shadow-md",
      )}
    >
      {/* Icône */}
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/20">
        <Icon className="size-6 text-violet-600" />
      </div>

      {/* Contenu */}
      <h3 className="mb-2 text-lg font-semibold leading-tight text-zinc-900">
        {service.name}
      </h3>
      <p className="mb-4 line-clamp-3 text-sm text-zinc-600">
        {service.description}
      </p>

      {/* Prix + action */}
      <div className="mt-auto flex items-center justify-between border-t border-zinc-100 pt-4">
        <div>
          <div className="text-xl font-bold text-violet-600">
            {displayPrice}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">
            {UNIT_LABELS[service.unit]}
            {service.unit === "PERSON" && guests > 1 && ` × ${guests} pers.`}
            {service.unit === "DAY" && nights > 0 && ` × ${nights} jours`}
          </div>
        </div>

        <button
          onClick={() => toggleService(service.id)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition",
            selected
              ? "bg-emerald-500 text-white"
              : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700",
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
  );
}
