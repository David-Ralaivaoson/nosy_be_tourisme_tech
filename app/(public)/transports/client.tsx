"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  PlaneTakeoff,
  KeyRound,
  Sparkles,
} from "lucide-react";
import { differenceInDays, parseISO } from "date-fns";
import type { TransportOption, TransportType } from "@prisma/client";
import { cn } from "@/src/lib/utils";
import { useQuoteStore } from "@/src/store/quote-store";
import TransportCard from "@/src/components/transports/TransportCard";
import PageHero from "@/src/components/shared/PageHero";

const TYPES: { value: TransportType | "tous"; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "TRANSFER", label: "Transferts" },
  { value: "VEHICLE_RENTAL", label: "Locations" },
];

const UNITS: { value: "TRIP" | "DAY" | "tous"; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "TRIP", label: "Par trajet" },
  { value: "DAY", label: "Par jour" },
];

export default function TransportsClient({
  initialTransports,
}: {
  initialTransports: TransportOption[];
}) {
  const searchParams = useSearchParams();
  const { arrivalDate, departureDate } = useQuoteStore();

  const [type, setType] = useState<TransportType | "tous">("tous");
  const [unit, setUnit] = useState<"TRIP" | "DAY" | "tous">("tous");
  const [withDriver, setWithDriver] = useState<boolean | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(500_000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && TYPES.some((t) => t.value === typeParam)) {
      setType(typeParam as TransportType);
    }
  }, [searchParams]);

  const nights = useMemo(() => {
    if (!arrivalDate || !departureDate) return 0;
    try {
      return Math.max(
        0,
        differenceInDays(parseISO(departureDate), parseISO(arrivalDate)),
      );
    } catch {
      return 0;
    }
  }, [arrivalDate, departureDate]);

  const filtered = useMemo(
    () =>
      initialTransports.filter(
        (t) =>
          (type === "tous" || t.transportType === type) &&
          (unit === "tous" || t.unit === unit) &&
          (withDriver === null || t.withDriver === withDriver) &&
          t.price <= maxPrice,
      ),
    [initialTransports, type, unit, withDriver, maxPrice],
  );

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-violet-200/25 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
        {/* ============ HERO ============ */}
        <PageHero
          badgeIcon={<PlaneTakeoff className="size-3.5 text-violet-500" />}
          badgeLabel={`${filtered.length} transport${filtered.length > 1 ? "s" : ""}`}
          titleTop="Déplacez-vous à"
          titleAccent="Sainte-Marie"
          description="Transferts privés depuis l'aéroport ou le port, et véhicules avec ou sans chauffeur pour explorer l'île à votre rythme."
          image="/textures/sainte-marie-plages.jpg"
          imageAlt="Pirogues traditionnelles sur la plage de Sainte-Marie"
        />

        {/* ============ BANNIÈRE DATES ============ */}
        {nights > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-10 flex items-start gap-3 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
          >
            <Sparkles className="mt-0.5 size-5 shrink-0 text-violet-500" />
            <p className="text-sm text-[#17123a]/60">
              <span className="font-semibold text-[#17123a]">Vos dates :</span>{" "}
              {arrivalDate} → {departureDate}. Les locations à la journée seront
              facturées sur{" "}
              <span className="font-bold text-violet-600">
                {nights} jour{nights > 1 ? "s" : ""}
              </span>
              .
            </p>
          </motion.div>
        )}

        {/* ============ TOGGLE FILTRES MOBILE ============ */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mb-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#17123a] shadow-sm lg:hidden"
        >
          <SlidersHorizontal className="size-4 text-violet-500" /> Filtres
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
          {/* ============ SIDEBAR FILTRES ============ */}
          <aside
            className={cn(
              "h-fit space-y-7 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-violet-900/5 lg:sticky lg:top-28 lg:block",
              showFilters ? "block" : "hidden",
            )}
          >
            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17123a]/35">
                Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setType(t.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                      type === t.value
                        ? "border-transparent bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                        : "border-slate-200 bg-slate-50 text-[#17123a]/55 hover:border-violet-200 hover:bg-violet-50",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17123a]/35">
                Tarification
              </h3>
              <div className="flex flex-wrap gap-2">
                {UNITS.map((u) => (
                  <button
                    key={u.value}
                    onClick={() => setUnit(u.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                      unit === u.value
                        ? "border-transparent bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                        : "border-slate-200 bg-slate-50 text-[#17123a]/55 hover:border-violet-200 hover:bg-violet-50",
                    )}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17123a]/35">
                Chauffeur
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: null, label: "Tous" },
                  { value: true, label: "Avec chauffeur" },
                  { value: false, label: "Sans chauffeur" },
                ].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setWithDriver(opt.value as boolean | null)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                      withDriver === opt.value
                        ? "border-transparent bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                        : "border-slate-200 bg-slate-50 text-[#17123a]/55 hover:border-violet-200 hover:bg-violet-50",
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17123a]/35">
                Prix maximum
              </h3>
              <div className="mb-3 text-base font-extrabold text-violet-600">
                {new Intl.NumberFormat("fr-FR").format(maxPrice)} Ar
              </div>
              <input
                type="range"
                min={50_000}
                max={500_000}
                step={10_000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
                className="w-full accent-violet-600"
              />
            </div>

            <button
              onClick={() => {
                setType("tous");
                setUnit("tous");
                setWithDriver(null);
                setMaxPrice(500_000);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[#17123a]/50 transition-colors hover:bg-slate-100"
            >
              Réinitialiser
            </button>
          </aside>

          {/* ============ GRILLE ============ */}
          <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <TransportCard transport={t} estimatedDays={nights} />
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                <KeyRound className="mx-auto mb-4 size-8 text-slate-300" />
                <p className="text-lg font-semibold text-[#17123a]/70">
                  Aucun transport ne correspond à vos filtres.
                </p>
                <p className="mt-2 text-sm text-[#17123a]/40">
                  Essayez d'élargir vos critères.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
