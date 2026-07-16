"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Plane,
  Wallet,
  Languages,
  Thermometer,
  Heart,
  Phone,
  Zap,
  FileText,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const infos = [
  {
    icon: Plane,
    title: "Comment venir",
    description:
      "Vols directs Paris-Nosy Be (11h). Antananarivo-Nosy Be (1h30). Aéroport international de Fascene (NOS).",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: FileText,
    title: "Visa",
    description:
      "Visa touristique obligatoire, délivré à l'arrivée (35€ pour 30 jours). Passeport valide 6 mois après le retour.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Wallet,
    title: "Monnaie",
    description:
      "Ariary malgache (MGA). 1€ ≈ 4 700 MGA. Euros acceptés dans hôtels. Cartes Visa/Mastercard avec frais.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Languages,
    title: "Langue",
    description:
      "Malgache et français sont les langues officielles. Le français est largement parlé dans les zones touristiques.",
    color: "text-violet-400",
    bg: "bg-violet-500/10",
  },
  {
    icon: Heart,
    title: "Santé",
    description:
      "Vaccins recommandés : hépatite A/B, typhoïde, tétanos. Traitement antipaludéen fortement conseillé.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: Thermometer,
    title: "Climat",
    description:
      "Tropical chaud toute l'année. Saison sèche (avril-novembre) idéale. Température : 25-32°C.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Phone,
    title: "Téléphone",
    description:
      "Indicatif : +261. Opérateurs : Telma, Orange, Airtel. Forfaits touristiques disponibles. WiFi dans la plupart des hôtels.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Zap,
    title: "Électricité",
    description:
      "220V, prises européennes (type C/E). Adaptateur non nécessaire pour la France. Prévoir une lampe de poche.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
  },
];

export function PracticalInfo() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".info-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
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
      id="infos"
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#050505] relative z-20 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-4">
            Infos Pratiques
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
            Avant de{" "}
            <span className="italic font-serif text-cyan-400">partir</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
            Tout ce qu'il faut savoir pour préparer votre voyage à Nosy Be en
            toute sérénité.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {infos.map((info, i) => {
            const Icon = info.icon;
            return (
              <div
                key={i}
                className="info-card p-6 rounded-2xl bg-[#151515] border border-white/5 hover:border-white/10 transition-all duration-500 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${info.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`w-6 h-6 ${info.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {info.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
