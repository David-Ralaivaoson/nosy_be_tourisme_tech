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
      "Vol Antananarivo – Sainte-Marie (1h15, aéroport SMS) ou bateau depuis Soanierana-Ivongo (1h30–2h).",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: FileText,
    title: "Visa",
    description:
      "Visa touristique obligatoire, délivré à l'arrivée (35€ pour 30 jours). Passeport valide 6 mois après le retour.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Wallet,
    title: "Monnaie",
    description:
      "Ariary malgache (MGA). 1€ ≈ 4 900 MGA. Euros acceptés dans les hôtels. Cartes Visa avec frais.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Languages,
    title: "Langue",
    description:
      "Malgache et français officiels. Le français est largement parlé à Ambodifotatra et dans les hôtels.",
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    icon: Heart,
    title: "Santé",
    description:
      "Vaccins recommandés : hépatite A/B, typhoïde, tétanos. Traitement antipaludéen conseillé.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: Thermometer,
    title: "Climat",
    description:
      "Tropical chaud toute l'année. Saison sèche avril–novembre idéale. Baleines juillet–octobre.",
    color: "text-cyan-600",
    bg: "bg-cyan-50",
  },
  {
    icon: Phone,
    title: "Téléphone",
    description:
      "Indicatif +261. Opérateurs : Telma, Orange, Airtel. WiFi dans la plupart des hôtels.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Zap,
    title: "Électricité",
    description:
      "220V, prises type C/E. Coupures possibles : prévoyez une powerbank et une lampe torche.",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
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
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#fbfaff] relative z-20 border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="text-xs uppercase tracking-widest text-cyan-600 font-bold mb-4">
            Infos Pratiques
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-[#17123a]">
            Avant de{" "}
            <span className="italic font-serif text-cyan-600">partir</span>
          </h2>
          <p className="text-[#17123a]/50 text-lg md:text-xl max-w-2xl font-light">
            Tout ce qu'il faut savoir pour préparer votre voyage à Sainte-Marie
            en toute sérénité.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {infos.map((info, i) => (
            <div
              key={i}
              className="info-card p-6 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-lg transition-all duration-500 group"
            >
              <div
                className={`w-12 h-12 rounded-xl ${info.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
              >
                <info.icon className={`w-6 h-6 ${info.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-[#17123a]">
                {info.title}
              </h3>
              <p className="text-sm text-[#17123a]/60 leading-relaxed">
                {info.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
