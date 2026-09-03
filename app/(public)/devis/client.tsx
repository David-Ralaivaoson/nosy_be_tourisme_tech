"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BedDouble, Ticket, CarFront, Sparkles } from "lucide-react";
import type {
  Accommodation,
  AdditionalService,
  Excursion,
  TransportOption,
} from "@prisma/client";
import { useQuoteStore, selectQuoteCount } from "@/src/store/quote-store";
import { calculateNights } from "@/src/lib/pricing";
import QuoteRecap from "@/src/components/devis/QuoteRecap";
import LeadForm from "@/src/components/devis/LeadForm";
import PageHero from "@/src/components/shared/PageHero";

interface Props {
  accommodations: Accommodation[];
  excursions: Excursion[];
  transports: TransportOption[];
  services: AdditionalService[];
}

const navItems = [
  {
    href: "/hebergements",
    label: "Hébergements",
    icon: BedDouble,
    color: "violet",
  },
  { href: "/excursions", label: "Excursions", icon: Ticket, color: "blue" },
  {
    href: "/transports",
    label: "Transports",
    icon: CarFront,
    color: "emerald",
  },
  { href: "/services", label: "Services +", icon: Sparkles, color: "pink" },
];

const colorClasses: Record<string, string> = {
  violet: "bg-violet-50 text-violet-600",
  blue: "bg-blue-50 text-blue-600",
  emerald: "bg-emerald-50 text-emerald-600",
  pink: "bg-pink-50 text-pink-600",
};

export default function DevisClient({
  accommodations,
  excursions,
  transports,
  services,
}: Props) {
  const count = useQuoteStore(selectQuoteCount);
  const {
    arrivalDate,
    departureDate,
    accommodationId,
    excursionIds,
    transportIds,
    serviceIds,
  } = useQuoteStore();
  const nights = calculateNights(arrivalDate, departureDate);
  const canSubmit = count > 0 && nights > 0;

  const getCount = (href: string) => {
    if (href === "/hebergements") return accommodationId ? 1 : 0;
    if (href === "/excursions") return excursionIds.length;
    if (href === "/transports") return transportIds.length;
    if (href === "/services") return serviceIds.length;
    return 0;
  };

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-violet-200/25 blur-[120px]" />

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-28 md:px-8 md:pt-32">
        {/* <PageHero
          badgeIcon={<Sparkles className="size-3.5 text-violet-500" />}
          badgeLabel="Devis instantané & gratuit"
          titleTop="Finalisez votre"
          titleAccent="voyage"
          description="Ajustez les quantités de chaque prestation selon vos besoins réels, puis validez pour recevoir votre itinéraire complet."
          image="/textures/sainte-marie-hero.png"
          imageAlt="Vue aérienne du sanctuaire des baleines, Sainte-Marie"
        /> */}

        {/* ═══════════════════════════════════════════════════════════════
            BOUTONS DE NAVIGATION PERSISTANTS
            ═══════════════════════════════════════════════════════════════ */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {navItems.map((item) => {
            const itemCount = getCount(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-violet-300 hover:shadow-md"
              >
                <div
                  className={`flex size-10 items-center justify-center rounded-xl ${colorClasses[item.color]}`}
                >
                  <item.icon className="size-5" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#17123a]/70">
                  {item.label}
                </span>
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex size-6 items-center justify-center rounded-full bg-violet-600 text-[10px] font-black text-white shadow-md">
                    {itemCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {count === 0 ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm">
            <p className="text-lg font-semibold text-[#17123a]/70">
              Votre devis est vide.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#17123a]/40">
              Utilisez les boutons ci-dessus pour explorer nos catalogues et
              ajouter des prestations à votre séjour.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_440px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-2 lg:order-1"
            >
              <LeadForm canSubmit={canSubmit} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <QuoteRecap
                accommodations={accommodations}
                excursions={excursions}
                transports={transports}
                services={services}
              />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
