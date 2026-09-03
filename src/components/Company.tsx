"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles, Zap, Compass, Users } from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

const values = [
  {
    icon: Sparkles,
    title: "Authenticité",
    desc: "Des expériences 100% locales, respectueuses de la culture et de l'environnement de l'île aux baleines.",
  },
  {
    icon: Zap,
    title: "Réactivité",
    desc: "Une équipe basée à Ambodifotatra, disponible 7j/7 pendant votre séjour.",
  },
  {
    icon: Compass,
    title: "Sur mesure",
    desc: "Devis instantané : hébergements, excursions et transports composés selon vos envies.",
  },
  {
    icon: Users,
    title: "Expertise",
    desc: "Guides certifiés, capitaines expérimentés pour le safari baleines en toute sécurité.",
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
      className="py-32 px-4 md:px-12 lg:px-24 bg-white relative z-20 overflow-hidden border-t border-slate-100"
    >
      <div className="absolute top-0 right-0 w-[400px] h-[600px] bg-violet-100/60 blur-[120px] rounded-full" />
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-10">
        <div className="flex-1 company-content">
          <div className="inline-block mb-8 text-[10px] uppercase tracking-[0.3em] font-bold text-violet-600">
            01. L'Agence
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 tracking-tighter text-[#17123a] leading-[1.1]">
            L'artisanat du voyage <br />
            <span className="italic font-serif text-violet-600">
              sur mesure.
            </span>
          </h2>
          <p className="text-lg md:text-xl text-[#17123a]/55 leading-relaxed max-w-2xl mb-12 font-light">
            Équipe locale passionnée basée à Ambodifotatra, nous créons des
            séjours authentiques à Sainte-Marie : safari baleines, Île aux
            Nattes, Baie d'Ampanihy, en combinant expertise terrain et
            hospitalité malgache.
          </p>
          <div className="values-grid grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
            {values.map((v, i) => (
              <div
                key={i}
                className="value-card p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-violet-200 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded bg-violet-50 flex items-center justify-center mb-4">
                  <v.icon className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#17123a]">
                  {v.title}
                </h3>
                <p className="text-sm text-[#17123a]/55 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="pt-8 flex items-center gap-6">
            <a
              href="/devis"
              className="px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest text-white hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/30 group flex items-center"
            >
              Composer mon voyage
              <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
        <div className="flex-1 company-content hidden lg:flex items-center justify-center relative">
          <div className="w-full aspect-square relative rounded-full border border-slate-200 flex items-center justify-center">
            <div className="absolute inset-8 rounded-full border border-violet-100 flex items-center justify-center animate-[spin_60s_linear_infinite]">
              <div className="absolute -top-2 left-1/2 w-4 h-4 rounded-full bg-violet-500 blur-sm" />
            </div>
            <div className="absolute inset-16 rounded-full border border-slate-100 flex items-center justify-center animate-[spin_40s_linear_infinite_reverse]">
              <div className="absolute top-1/2 -right-2 w-4 h-4 rounded-full bg-blue-500 blur-sm" />
            </div>
            <div className="w-32 h-32 rounded-full border border-violet-200 bg-white z-10 flex items-center justify-center shadow-[0_0_50px_rgba(124,58,237,.25)]">
              <Sparkles className="w-10 h-10 text-violet-400" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
