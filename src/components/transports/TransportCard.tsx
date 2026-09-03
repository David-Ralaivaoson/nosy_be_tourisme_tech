"use client";

import Link from "next/link";
import {
  Plane,
  Ship,
  CarFront,
  Car,
  Bike,
  Gauge,
  Users,
  Check,
  Plus,
  UserCheck,
} from "lucide-react";
import type { TransportOption } from "@prisma/client";
import { cn } from "@/src/lib/utils";
import { useQuoteStore } from "@/src/store/quote-store";
import { formatMGA } from "@/src/lib/pricing";

function getIcon(slug: string) {
  if (slug.includes("aeroport")) return Plane;
  if (slug.includes("port")) return Ship;
  if (slug.includes("4x4")) return CarFront;
  if (slug.includes("quad")) return Gauge;
  if (slug.includes("scooter")) return Bike;
  return Car;
}

export default function TransportCard({
  transport,
  estimatedDays,
}: {
  transport: TransportOption;
  estimatedDays: number;
}) {
  const { transportIds, toggleTransport } = useQuoteStore();
  const selected = transportIds.includes(transport.id);
  const Icon = getIcon(transport.slug);
  const isDaily = transport.unit === "DAY";
  const days = Math.max(1, estimatedDays);

  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm shadow-violet-900/5 transition-all duration-300",
        selected
          ? "border-emerald-400 shadow-lg shadow-emerald-500/10"
          : "border-slate-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-900/10",
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex size-12 items-center justify-center rounded-xl border border-violet-100 bg-violet-50">
          <Icon className="size-6 text-violet-600" />
        </div>
        {transport.withDriver && (
          <span className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">
            <UserCheck className="size-3" /> Chauffeur
          </span>
        )}
      </div>

      <Link
        href={`/transports/${transport.slug}`}
        className="mb-2 text-lg font-semibold leading-tight text-[#17123a] transition-colors hover:text-violet-600"
      >
        {transport.name}
      </Link>
      <p className="mb-4 line-clamp-3 text-sm text-[#17123a]/55">
        {transport.descriptionFr}
      </p>

      {transport.capacity && (
        <div className="mb-4 flex items-center gap-1.5 text-xs text-[#17123a]/50">
          <Users className="size-3.5 text-violet-600" />
          {transport.capacity} passager{transport.capacity > 1 ? "s" : ""} max
        </div>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <div className="text-xl font-bold text-violet-600">
            {formatMGA(transport.price)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-[#17123a]/40">
            {isDaily
              ? `/ jour${estimatedDays > 0 ? ` · ${days} j = ${formatMGA(transport.price * days)}` : ""}`
              : "/ trajet"}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleTransport(transport.id);
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
  );
}
