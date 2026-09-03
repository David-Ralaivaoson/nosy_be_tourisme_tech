"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { AdditionalService } from "@prisma/client";
import ServiceCard from "@/src/components/services/ServiceCard";
import PageHero from "@/src/components/shared/PageHero";

export default function ServicesClient({
  initialServices,
}: {
  initialServices: AdditionalService[];
}) {
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-violet-200/25 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
        {/* ============ HERO ============ */}
        <PageHero
          badgeIcon={<Plus className="size-3.5 text-violet-500" />}
          badgeLabel={`${initialServices.length} services premium`}
          titleTop="Services +"
          titleAccent="Sainte-Marie"
          description="Assurance voyage, guides experts, photographe, transferts VIP… Complétez votre séjour et ajoutez ces services à votre devis en un clic."
          image="/textures/sainte-marie-coucher.jpg"
          imageAlt="Coucher de soleil sur le lagon de Sainte-Marie"
        />

        {/* ============ BANDAU FEATURED ============ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 overflow-hidden rounded-3xl border border-violet-100 bg-gradient-to-r from-violet-50 via-indigo-50/60 to-transparent p-6 shadow-sm shadow-violet-900/5"
        >
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-bold uppercase tracking-widest text-violet-700">
                Services recommandés
              </div>
              <p className="mt-1 text-sm text-[#17123a]/60">
                Nos services les plus demandés pour un voyage sans souci à
                Sainte-Marie.
              </p>
            </div>
            <span className="w-fit rounded-full bg-violet-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-violet-700">
              ★ Top choix
            </span>
          </div>
        </motion.div>

        {/* ============ GRILLE ============ */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {initialServices.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
