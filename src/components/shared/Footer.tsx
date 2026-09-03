"use client";
import { Facebook, Instagram, Youtube } from "@hugeicons/core-free-icons";
import { MapPin, Mail, MessageCircle, Waves } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-16 px-4 md:px-12 lg:px-24 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center shadow-md shadow-violet-500/20">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-sm font-black uppercase tracking-[0.18em] text-[#17123a]">
                  Sainte-Marie
                </div>
                <div className="text-[9px] font-bold uppercase tracking-[0.3em] text-violet-600">
                  Travel · Madagascar
                </div>
              </div>
            </div>
            <p className="text-sm text-[#17123a]/55 leading-relaxed mb-6">
              Agence locale spécialisée dans les voyages sur mesure à
              Sainte-Marie : safari baleines, Île aux Nattes, Baie d'Ampanihy et
              circuits personnalisés.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 hover:bg-violet-50 hover:border-violet-200 flex items-center justify-center transition-all hover:-translate-y-1"
                >
                  <span
                    className="w-4 h-4 text-[#17123a]/55 hover:text-violet-600"
                    dangerouslySetInnerHTML={{
                      __html: (Icon as any)[1]?.body ?? "",
                    }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Explorer */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#17123a]">
              Explorer
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Hébergements", href: "/hebergements" },
                { label: "Excursions", href: "/excursions" },
                { label: "Transports", href: "/transports" },
                { label: "Services +", href: "/services" },
                { label: "Devis instantané", href: "/devis" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#17123a]/55 hover:text-violet-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#17123a]">
              Destinations
            </h3>
            <ul className="space-y-3">
              {[
                {
                  label: "Safari baleines",
                  href: "/excursions/safari-baleines",
                },
                { label: "Baie d'Ampanihy", href: "/excursions/baie-ampanihy" },
                { label: "Île aux Nattes", href: "/excursions/ile-aux-nattes" },
                {
                  label: "Piscines naturelles",
                  href: "/excursions/piscines-naturelles",
                },
                { label: "Maison Blanche", href: "/excursions/maison-blanche" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-[#17123a]/55 hover:text-violet-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-[#17123a]">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-[#17123a]/55">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-violet-600" />
                <span>Ambodifotatra, Île Sainte-Marie, Madagascar</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#17123a]/55">
                <MessageCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <a
                  href="https://wa.me/261328030046"
                  className="hover:text-emerald-600 transition-colors"
                >
                  +261 32 80 300 46 (WhatsApp)
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-[#17123a]/55">
                <Mail className="w-4 h-4 shrink-0 text-violet-600" />
                <a
                  href="mailto:contact@sainte-marie-travel.mg"
                  className="hover:text-violet-600 transition-colors"
                >
                  contact@sainte-marie-travel.mg
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#17123a]/45">
            © 2026 Sainte-Marie Travel. Tous droits réservés. 🇲🇬
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-[#17123a]/45 hover:text-[#17123a]/70 transition-colors"
            >
              Mentions légales
            </a>
            <a
              href="#"
              className="text-xs text-[#17123a]/45 hover:text-[#17123a]/70 transition-colors"
            >
              Confidentialité
            </a>
            <a
              href="#"
              className="text-xs text-[#17123a]/45 hover:text-[#17123a]/70 transition-colors"
            >
              CGV
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
