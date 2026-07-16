"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Code2, Cpu, Sparkles, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Sparkles,
    title: "Authenticité",
    desc: "Des expériences 100% locales et respectueuses de la culture sakalava.",
  },
  {
    icon: Zap,
    title: "Réactivité",
    desc: "Une équipe sur place disponible 24/7 pour assurer votre confort.",
  },
  {
    icon: Code2,
    title: "Sur mesure",
    desc: "Des circuits personnalisés selon vos envies, votre rythme et votre budget.",
  },
  {
    icon: Cpu,
    title: "Expertise",
    desc: "Des guides certifiés et passionnés qui connaissent chaque recoin de l'île.",
  },
];

export function Company() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".company-content > *",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
      gsap.fromTo(
        ".value-card",
        { scale: 0.9, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: ".values-grid",
            start: "top 85%",
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
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#050505] relative z-20 overflow-hidden border-t border-white/5"
    >
      <div className="absolute top-0 right-0 w-100 h-150 bg-violet-900/10 blur-[120px] rounded-full"></div>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
        <div className="flex-1 company-content">
          <div className="inline-block mb-8 text-[10px] uppercase tracking-[0.3em] font-bold text-violet-400">
            03. Le Guide
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 tracking-tighter text-white leading-[1.1]">
            L'artisanat du voyage <br />
            <span className="italic font-serif text-violet-400">
              sur mesure.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/50 leading-relaxed max-w-2xl mb-12 font-light">
            Nous sommes une équipe locale passionnée, spécialisée dans la
            création d'expériences touristiques authentiques à Nosy Be. Nous
            accompagnons les voyageurs dans la découverte de l'île aux parfums
            en combinant expertise terrain et hospitalité malgache.
          </p>
          <div className="values-grid grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {values.map((val, i) => {
              const Icon = val.icon;
              return (
                <div
                  key={i}
                  className="value-card p-6 rounded-xl bg-[#151515] border border-white/5 shadow-xl"
                >
                  <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{val.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="pt-8 flex items-center gap-6">
            <button className="px-8 py-3 bg-violet-600 rounded-full text-xs font-bold uppercase tracking-widest text-white hover:bg-violet-500 transition-all shadow-[0_0_20px_rgba(109,40,217,0.4)] group flex items-center">
              Discutons de votre projet
              <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
        <div className="flex-1 company-content hidden lg:flex items-center justify-center relative">
          <div className="w-full aspect-square relative rounded-full border border-white/5 flex items-center justify-center">
            <div className="absolute inset-8 rounded-full border border-white/10 flex items-center justify-center animate-[spin_60s_linear_infinite]">
              <div className="absolute -top-2 left-1/2 w-4 h-4 rounded-full bg-violet-500 blur-sm"></div>
            </div>
            <div className="absolute inset-16 rounded-full border border-white/5 flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]">
              <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-blue-500 blur-sm"></div>
            </div>
            <div className="w-32 h-32 rounded-full border border-white/20 bg-[#050505] z-10 flex items-center justify-center shadow-[0_0_50px_rgba(109,40,217,0.4)]">
              <Sparkles className="w-10 h-10 text-white/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
