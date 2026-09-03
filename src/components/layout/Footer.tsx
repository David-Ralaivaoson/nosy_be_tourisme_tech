import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black px-4 py-16 md:px-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 md:grid-cols-3">
        <div>
          <div className="text-lg font-bold uppercase tracking-[0.18em]">
            Sainte-Marie Travel
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/50">
            Agence locale spécialisée dans les voyages sur mesure à Sainte-Marie
            : safari baleines, Île aux Nattes, Baie d'Ampanihy et investissement
            immobilier.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/80">
            Explorer
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-white/50">
            <li>
              <Link className="hover:text-cyan-400" href="/hebergements">
                Hébergements
              </Link>
            </li>
            <li>
              <Link className="hover:text-cyan-400" href="/excursions">
                Excursions
              </Link>
            </li>
            <li>
              <Link className="hover:text-cyan-400" href="/transports">
                Transports
              </Link>
            </li>
            <li>
              <Link className="hover:text-cyan-400" href="/immobilier">
                Immobilier
              </Link>
            </li>
            <li>
              <Link className="hover:text-cyan-400" href="/devis">
                Devis instantané
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-white/80">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/50">
            <li className="flex items-center gap-2">
              <MessageCircle className="size-4 text-emerald-400" />
              <a
                href="https://wa.me/261328030046"
                className="hover:text-emerald-400"
              >
                +261 32 80 300 46 (WhatsApp)
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-cyan-400" />
              <a
                href="mailto:contact@sainte-marie-travel.mg"
                className="hover:text-cyan-400"
              >
                contact@sainte-marie-travel.mg
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-amber-400" />
              Ambodifotatra, Île Sainte-Marie, Madagascar
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 md:flex-row">
        <p className="text-xs text-white/40">
          © 2026 Sainte-Marie Travel. Tous droits réservés. 🇲🇬
        </p>
        <div className="flex gap-6 text-xs text-white/40">
          <a href="#" className="hover:text-white/70">
            Mentions légales
          </a>
          <a href="#" className="hover:text-white/70">
            Confidentialité
          </a>
          <a href="#" className="hover:text-white/70">
            CGV
          </a>
        </div>
      </div>
    </footer>
  );
}
