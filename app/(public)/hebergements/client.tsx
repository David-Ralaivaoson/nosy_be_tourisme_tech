"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { SlidersHorizontal, MapPin, Sparkles, RotateCcw } from "lucide-react";
import type {
  Accommodation,
  AccommodationCategory,
  AccommodationZone,
} from "@prisma/client";
import { cn } from "@/src/lib/utils";
import AccommodationCard from "@/src/components/hebergements/AccommodationCard";
import WaveHeroImage from "@/src/components/hebergements/WaveHeroImage";

const CATEGORIES: { value: AccommodationCategory | "tous"; label: string }[] = [
  { value: "tous", label: "Tous" },
  { value: "HOTEL", label: "Hôtels" },
  { value: "BUNGALOW", label: "Bungalows" },
  { value: "VILLA", label: "Villas" },
  { value: "ECOLODGE", label: "Écolodges" },
  { value: "LUXE", label: "Luxe" },
  { value: "GUEST_HOUSE", label: "Chambres d'hôtes" },
];

const ZONES: { value: AccommodationZone | "tous"; label: string }[] = [
  { value: "tous", label: "Toutes zones" },
  { value: "NORTH", label: "Nord" },
  { value: "SOUTH", label: "Sud" },
  { value: "WEST", label: "Ouest" },
  { value: "EAST", label: "Est" },
  { value: "CENTER", label: "Centre" },
];

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=1400&q=80";

export default function HebergementsClient({
  initialAccommodations,
}: {
  initialAccommodations: Accommodation[];
}) {
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<AccommodationCategory | "tous">(
    "tous",
  );
  const [zone, setZone] = useState<AccommodationZone | "tous">("tous");
  const [maxBudget, setMaxBudget] = useState<number>(1_200_000);
  const [minStars, setMinStars] = useState<number>(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && CATEGORIES.some((c) => c.value === categoryParam)) {
      setCategory(categoryParam as AccommodationCategory);
    }
    const zoneParam = searchParams.get("zone");
    if (zoneParam && ZONES.some((z) => z.value === zoneParam)) {
      setZone(zoneParam as AccommodationZone);
    }
  }, [searchParams]);

  const filtered = useMemo(
    () =>
      initialAccommodations.filter(
        (a) =>
          (category === "tous" || a.category === category) &&
          (zone === "tous" || a.zone === zone) &&
          a.pricePerNightLowSeason <= maxBudget &&
          a.stars >= minStars,
      ),
    [initialAccommodations, category, zone, maxBudget, minStars],
  );

  return (
    <div className="relative overflow-hidden">
      {/* Halo décoratif en fond, cohérent avec l'identité violette du header */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-violet-200/25 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
        {/* ============ HERO ============ */}
        <div className="mb-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-1.5 shadow-sm shadow-violet-900/5">
              <Sparkles className="size-3.5 text-violet-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600">
                {filtered.length} hébergement{filtered.length > 1 ? "s" : ""}
              </span>
            </div>

            <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-[#17123a] md:text-6xl">
              Hébergements à
              <span className="mt-1 block font-serif text-4xl italic font-medium text-violet-500 md:text-6xl">
                Sainte-Marie
              </span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-relaxed text-[#17123a]/55 md:text-lg">
              Des écolodges intimistes aux villas de luxe. Sélectionnez votre
              style, puis ajoutez vos coups de cœur à votre devis.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <WaveHeroImage src={HERO_IMAGE} alt="Bungalows à Sainte-Marie" />
          </motion.div>
        </div>

        {/* ============ TOGGLE FILTRES MOBILE ============ */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="mb-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#17123a] shadow-sm lg:hidden"
        >
          <SlidersHorizontal className="size-4 text-violet-500" /> Filtres
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[272px_1fr]">
          {/* ============ SIDEBAR FILTRES ============ */}
          <aside
            className={cn(
              "h-fit space-y-7 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-violet-900/5 lg:sticky lg:top-28 lg:block",
              showFilters ? "block" : "hidden",
            )}
          >
            {/* Catégorie */}
            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17123a]/35">
                Catégorie
              </h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setCategory(c.value)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
                      category === c.value
                        ? "border-transparent bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                        : "border-slate-200 bg-slate-50 text-[#17123a]/55 hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700",
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Zone */}
            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17123a]/35">
                Zone
              </h3>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-violet-400" />
                <select
                  value={zone}
                  onChange={(e) =>
                    setZone(e.target.value as AccommodationZone | "tous")
                  }
                  className="w-full cursor-pointer appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm font-medium text-[#17123a] outline-none transition-colors focus:border-violet-300 focus:bg-white"
                >
                  {ZONES.map((z) => (
                    <option key={z.value} value={z.value}>
                      {z.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Budget */}
            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17123a]/35">
                Budget max / nuit
              </h3>
              <div className="mb-3 text-base font-extrabold text-violet-600">
                {new Intl.NumberFormat("fr-FR").format(maxBudget)} Ar
              </div>
              <input
                type="range"
                min={50_000}
                max={1_200_000}
                step={10_000}
                value={maxBudget}
                onChange={(e) => setMaxBudget(+e.target.value)}
                className="w-full accent-violet-600"
              />
            </div>

            {/* Étoiles */}
            <div>
              <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17123a]/35">
                Étoiles minimum
              </h3>
              <div className="flex gap-2">
                {[0, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setMinStars(n)}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl border text-sm font-bold transition-all duration-200",
                      minStars === n
                        ? "border-transparent bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/25"
                        : "border-slate-200 bg-slate-50 text-[#17123a]/55 hover:border-violet-200 hover:bg-violet-50",
                    )}
                  >
                    {n === 0 ? "★" : n}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                setCategory("tous");
                setZone("tous");
                setMaxBudget(1_200_000);
                setMinStars(0);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-[#17123a]/50 transition-colors hover:bg-slate-100"
            >
              <RotateCcw className="size-3.5" />
              Réinitialiser
            </button>
          </aside>

          {/* ============ GRID CARDS ============ */}
          <div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((acc, i) => (
                <motion.div
                  key={acc.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                >
                  <AccommodationCard acc={acc} />
                </motion.div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
                <MapPin className="mx-auto mb-4 size-8 text-slate-300" />
                <p className="text-lg font-semibold text-[#17123a]/70">
                  Aucun hébergement ne correspond à vos filtres.
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
