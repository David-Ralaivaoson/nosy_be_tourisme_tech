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
  ArrowRight,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const accommodations = [
  {
    name: "Concorde Hotel Nosy Be",
    type: "Hôtel 4 étoiles",
    location: "Ambatoloaka",
    price: "185€",
    priceUnit: "/ nuit",
    rating: 4.5,
    reviews: 342,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    features: [
      { icon: Waves, label: "Piscine" },
      { icon: Wifi, label: "WiFi" },
      { icon: Utensils, label: "Restaurant" },
    ],
    description:
      "Hôtel de standing avec vue panoramique sur la mer, piscine à débordement et spa.",
    tag: "Premium",
  },
  {
    name: "Ravintsara Wellness Hotel",
    type: "Hôtel-Boutique",
    location: "Andilana",
    price: "220€",
    priceUnit: "/ nuit",
    rating: 4.8,
    reviews: 218,
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    features: [
      { icon: TreePalm, label: "Spa" },
      { icon: Waves, label: "Plage privée" },
      { icon: Wifi, label: "Wellness" },
    ],
    description:
      "Hôtel de charme spécialisé dans le bien-être avec centre de thalassothérapie.",
    tag: "Coup de cœur",
  },
  {
    name: "Chez Neny Lodge",
    type: "Lodge authentique",
    location: "Nosy Komba",
    price: "95€",
    priceUnit: "/ nuit",
    rating: 4.7,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
    features: [
      { icon: TreePalm, label: "Nature" },
      { icon: Utensils, label: "Pension complète" },
      { icon: Waves, label: "Vue mer" },
    ],
    description:
      "Bungalows traditionnels en bord de mer, immersion totale dans la nature.",
    tag: "Authentique",
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
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#0a0a0a] relative z-20 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold mb-4">
            Hébergements
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
            Où dormir à{" "}
            <span className="italic font-serif text-emerald-400">
              Nosy Be ?
            </span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
            Des hébergements sélectionnés pour leur authenticité, leur confort
            et leur emplacement idéal.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {accommodations.map((acc, i) => (
            <div
              key={i}
              className="accommodation-card group relative bg-[#151515] rounded-2xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all duration-500"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={acc.image}
                  alt={acc.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-violet-600 text-white text-xs font-bold uppercase tracking-wider">
                  {acc.tag}
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-bold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {acc.rating}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2 text-xs text-violet-400 uppercase tracking-wider">
                  <MapPin className="w-3 h-3" />
                  <span>{acc.location}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{acc.name}</h3>
                <div className="text-sm text-white/50 mb-3">{acc.type}</div>
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  {acc.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {acc.features.map((feat, j) => {
                    const Icon = feat.icon;
                    return (
                      <div
                        key={j}
                        className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-xs text-white/70"
                      >
                        <Icon className="w-3 h-3" />
                        {feat.label}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <span className="text-2xl font-bold text-violet-400">
                      {acc.price}
                    </span>
                    <span className="text-xs text-white/50 ml-1">
                      {acc.priceUnit}
                    </span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 rounded-full text-xs font-bold uppercase tracking-wider transition-all group/btn">
                    Réserver
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
