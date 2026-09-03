"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Star,
  MapPin,
  Wifi,
  Utensils,
  Waves,
  TreePalm,
  Sun,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
gsap.registerPlugin(ScrollTrigger);

const accommodations = [
  {
    name: "Ravinala Beach Lodge",
    type: "Lodge 5 étoiles",
    location: "Côte ouest",
    price: "480 000 Ar",
    priceUnit: "/ nuit",
    rating: 4.8,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    features: [
      { icon: Waves, label: "Piscine" },
      { icon: Wifi, label: "WiFi" },
      { icon: Utensils, label: "Restaurant" },
    ],
    description:
      "Lodge pieds dans l'eau face au coucher de soleil, plage privée et spa.",
    tag: "Premium",
    href: "/hebergements/ravinala-beach-lodge",
  },
  {
    name: "Écolodge Île aux Nattes",
    type: "Écolodge solaire",
    location: "Île aux Nattes",
    price: "300 000 Ar",
    priceUnit: "/ nuit",
    rating: 4.9,
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    features: [
      { icon: Sun, label: "Solaire" },
      { icon: Waves, label: "Plage privée" },
      { icon: TreePalm, label: "Kayak" },
    ],
    description:
      "Immersion totale dans la nature, bungalows en matériaux locaux.",
    tag: "Éco",
    href: "/hebergements/ecolodge-ile-aux-nattes",
  },
  {
    name: "Bungalows Ampanihy",
    type: "Bungalows authentiques",
    location: "Baie d'Ampanihy",
    price: "150 000 Ar",
    priceUnit: "/ nuit",
    rating: 4.5,
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
    features: [
      { icon: TreePalm, label: "Vue mer" },
      { icon: Utensils, label: "Restaurant" },
      { icon: Waves, label: "Plage" },
    ],
    description:
      "Bungalows traditionnels en bord de baie, immersion locale garantie.",
    tag: "Authentique",
    href: "/hebergements/bungalows-ampanihy",
  },
];

export function Accommodations() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".accommodation-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, container);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={container}
      id="hebergements"
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#fbfaff] relative z-20 border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-600 font-bold mb-4">
              Hébergements
            </div>
            <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-[#17123a]">
              Où dormir à{" "}
              <span className="italic font-serif text-emerald-600">
                Sainte-Marie ?
              </span>
            </h2>
            <p className="text-[#17123a]/50 text-lg md:text-xl max-w-2xl font-light">
              Des hébergements sélectionnés pour leur authenticité, leur confort
              et leur emplacement face au lagon.
            </p>
          </div>
          <Link
            href="/hebergements"
            className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-2"
          >
            Voir tout <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {accommodations.map((acc, i) => (
            <div
              key={i}
              className="accommodation-card group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-violet-300 shadow-sm hover:shadow-2xl hover:shadow-violet-950/10 transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={acc.image}
                  alt={acc.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-bold uppercase tracking-wider">
                  {acc.tag}
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm text-[#17123a] text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  {acc.rating}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2 text-xs text-violet-600 uppercase tracking-wider">
                  <MapPin className="w-3 h-3" />
                  <span>{acc.location}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#17123a]">
                  {acc.name}
                </h3>
                <div className="text-sm text-[#17123a]/50 mb-3">{acc.type}</div>
                <p className="text-sm text-[#17123a]/60 leading-relaxed mb-4">
                  {acc.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {acc.features.map((f, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-1 px-2 py-1 rounded-md bg-violet-50 text-xs text-[#17123a]/70"
                    >
                      <f.icon className="w-3 h-3 text-violet-600" />
                      {f.label}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-xl font-bold text-violet-600">
                      {acc.price}
                    </span>
                    <span className="text-xs text-[#17123a]/50 ml-1">
                      {acc.priceUnit}
                    </span>
                  </div>
                  <Link
                    href={acc.href}
                    className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all group/btn"
                  >
                    Détails
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
