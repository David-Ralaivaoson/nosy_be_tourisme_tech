"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, Utensils } from "lucide-react";
import type { Excursion } from "@prisma/client";
import { cn } from "@/src/lib/utils";
import ExcursionCard from "@/src/components/excursions/ExcursionCard";
import PageHero from "@/src/components/shared/PageHero";

type Sort = "reco" | "price-asc" | "price-desc";

export default function ExcursionsClient({
  initialExcursions,
}: {
  initialExcursions: Excursion[];
}) {
  const [search, setSearch] = useState("");
  const [lunchOnly, setLunchOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("reco");

  const filtered = useMemo(() => {
    let list = [...initialExcursions];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          (e.descriptionFr ?? "").toLowerCase().includes(q),
      );
    }

    if (lunchOnly) list = list.filter((e) => e.includesLunch);

    if (sort === "price-asc")
      list.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    if (sort === "price-desc")
      list.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
    if (sort === "reco")
      list.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));

    return list;
  }, [initialExcursions, search, lunchOnly, sort]);

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-violet-200/25 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
        {/* ============ HERO ============ */}
        <PageHero
          badgeIcon={<Sparkles className="size-3.5 text-violet-500" />}
          badgeLabel={`${initialExcursions.length} expériences`}
          titleTop="Excursions à"
          titleAccent="Sainte-Marie"
          description="Safari baleines, Île aux Nattes, Baie d'Ampanihy… Chaque sortie est encadrée par des guides locaux certifiés et s'ajoute à votre devis en un clic."
          image="/textures/sainte-marie-activites.jpg"
          imageAlt="Catamaran d'observation des baleines à Sainte-Marie"
        />

        {/* ============ BANNIÈRE SAISON BALEINES ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-10 overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 via-indigo-50/60 to-transparent p-6 shadow-sm shadow-violet-900/5"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-widest text-violet-700">
                Juillet — Septembre
              </div>
              <p className="mt-1 text-sm text-[#17123a]/60">
                Saison des baleines à bosse dans le sanctuaire de Sainte-Marie.
                Les safaris partent vite : réservez votre créneau tôt.
              </p>
            </div>
            <span className="w-fit rounded-full bg-violet-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-violet-700">
              Période star ★
            </span>
          </div>
        </motion.div>

        {/* ============ FILTRES ============ */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#17123a]/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une excursion (baleines, plongée, baie...)"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-[#17123a] shadow-sm outline-none transition focus:border-violet-300"
            />
          </div>

          <button
            onClick={() => setLunchOnly(!lunchOnly)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold uppercase tracking-widest transition",
              lunchOnly
                ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                : "border-slate-200 bg-white text-[#17123a]/55 shadow-sm hover:border-slate-300",
            )}
          >
            <Utensils className="size-4" />
            Déjeuner inclus
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-[#17123a] shadow-sm outline-none focus:border-violet-300"
          >
            <option value="reco">Recommandés</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
        </div>

        {/* ============ GRILLE ============ */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((exc, i) => (
            <motion.div
              key={exc.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <ExcursionCard exc={exc} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#17123a]/70">
              Aucune excursion trouvée.
            </p>
            <p className="mt-2 text-sm text-[#17123a]/40">
              Modifiez votre recherche ou vos filtres.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
