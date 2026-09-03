"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Plus,
  CarFront,
  Users,
  UserCheck,
  CalendarDays,
  Plane,
  Ship,
  Car,
  Bike,
  Gauge,
} from "lucide-react";
import type { TransportOption } from "@prisma/client";
import { useQuoteStore } from "@/src/store/quote-store";
import { formatMGA } from "@/src/lib/pricing";
import { cn } from "@/src/lib/utils";

function getIcon(slug: string) {
  if (slug.includes("aeroport")) return Plane;
  if (slug.includes("port")) return Ship;
  if (slug.includes("4x4")) return CarFront;
  if (slug.includes("quad")) return Gauge;
  if (slug.includes("scooter")) return Bike;
  return Car;
}

export default function TransportDetailsClient({
  transport,
}: {
  transport: TransportOption;
}) {
  const { transportIds, toggleTransport } = useQuoteStore();
  const selected = transportIds.includes(transport.id);
  const Icon = getIcon(transport.slug);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
      <Link
        href="/transports"
        className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#17123a]/55 transition hover:text-violet-600"
      >
        <ArrowLeft className="size-4" />
        Retour aux transports
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
            <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-violet-50 to-indigo-50 shadow-lg shadow-violet-900/10">
              <Icon className="size-24 text-violet-400/60" />
              <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-violet-700 backdrop-blur-sm shadow-sm">
                {transport.transportType === "TRANSFER"
                  ? "Transfert"
                  : "Location"}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <h1 className="mb-4 text-4xl font-black tracking-tight text-[#17123a] md:text-5xl">
              {transport.name}
            </h1>

            <div className="mb-6 flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-[#17123a]/70 shadow-sm">
                <CalendarDays className="size-4 text-violet-600" />
                {transport.unit === "DAY"
                  ? "Tarif à la journée"
                  : "Tarif au trajet"}
              </span>
              {transport.withDriver && (
                <span className="flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
                  <UserCheck className="size-4" /> Chauffeur inclus
                </span>
              )}
              {transport.capacity && (
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                  <Users className="size-4" /> {transport.capacity} passagers
                  max
                </span>
              )}
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-[#17123a]/60">
              {transport.descriptionFr ||
                "Profitez d'un transport confortable et sécurisé pour vos déplacements à Sainte-Marie."}
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
                {formatMGA(transport.price)}
              </div>
              <div className="text-xs text-[#17123a]/40">
                {transport.unit === "DAY" ? "par jour" : "par trajet"}
              </div>
            </div>

            <div className="mb-6 rounded-xl bg-violet-50 p-4 text-sm text-violet-700">
              {transport.unit === "DAY" ? (
                <>
                  Les locations à la journée seront calculées automatiquement
                  selon la durée de votre séjour lors de la validation du devis.
                </>
              ) : (
                <>
                  Ce tarif s'applique pour un trajet simple (ex: aéroport vers
                  votre hôtel).
                </>
              )}
            </div>

            <button
              onClick={() => toggleTransport(transport.id)}
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
