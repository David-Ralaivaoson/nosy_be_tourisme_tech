"use client";

import { Facebook, Instagram, Youtube } from "@hugeicons/core-free-icons";
import {
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#000000] border-t border-white/5 py-16 px-4 md:px-12 lg:px-24 relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center font-bold">
                NB
              </div>
              <span className="text-lg font-bold">Nosy Be Guide</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Votre guide touristique expert pour découvrir Nosy Be et l'île aux
              parfums.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-violet-500/20 flex items-center justify-center transition-all hover:-translate-y-1"
                >
                  {/* @hugeicons exports icon data (not React components). Render SVG markup directly. */}
                  <span
                    className="w-4 h-4 text-white/60 hover:text-violet-400"
                    // icon object shape: [name, { body: '<svg ...</svg>' }]
                    dangerouslySetInnerHTML={{ __html: (Icon as any)[1]?.body ?? "" }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
              Destinations
            </h3>
            <ul className="space-y-3">
              {[
                "Nosy Komba",
                "Nosy Tanikely",
                "Lokobe",
                "Nosy Iranja",
                "Hell Ville",
                "Amparihy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {[
                "Excursions",
                "Plongée",
                "Hébergements",
                "Transferts",
                "Guides locaux",
                "Circuits sur mesure",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-white/50 hover:text-violet-400 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/50">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-violet-400" />
                <span>Rue du Commerce, Hell Ville, Nosy Be 207</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Phone className="w-4 h-4 shrink-0 text-violet-400" />
                <span>+261 34 12 345 67</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Mail className="w-4 h-4 shrink-0 text-violet-400" />
                <span>contact@nosybe-guide.mg</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            © 2026 Nosy Be Guide. Tous droits réservés. 🇲🇬
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Mentions légales
            </a>
            <a
              href="#"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Confidentialité
            </a>
            <a
              href="#"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              CGV
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
