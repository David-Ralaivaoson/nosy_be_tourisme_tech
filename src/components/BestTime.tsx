"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Thermometer,
  Check,
  X,
  Sun,
  Droplets,
  Cloud,
  Anchor,
} from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

const months = [
  { name: "Jan", temp: 30, rain: 85, recommended: false, whales: false },
  { name: "Fév", temp: 30, rain: 80, recommended: false, whales: false },
  { name: "Mar", temp: 30, rain: 70, recommended: false, whales: false },
  { name: "Avr", temp: 29, rain: 45, recommended: true, whales: false },
  { name: "Mai", temp: 28, rain: 25, recommended: true, whales: false },
  { name: "Juin", temp: 27, rain: 15, recommended: true, whales: false },
  { name: "Juil", temp: 26, rain: 10, recommended: true, whales: true },
  { name: "Août", temp: 26, rain: 10, recommended: true, whales: true },
  { name: "Sep", temp: 27, rain: 15, recommended: true, whales: true },
  { name: "Oct", temp: 28, rain: 25, recommended: true, whales: true },
  { name: "Nov", temp: 29, rain: 45, recommended: true, whales: false },
  { name: "Déc", temp: 30, rain: 75, recommended: false, whales: false },
];

export function BestTime() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".month-bar",
        { scaleY: 0, transformOrigin: "bottom" },
        {
          scaleY: 1,
          duration: 0.6,
          stagger: 0.05,
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
      className="py-32 px-4 md:px-12 lg:px-24 bg-white relative z-20 border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-4">
            Meilleure Période
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-[#17123a]">
            Quand partir à{" "}
            <span className="italic font-serif text-amber-600">
              Sainte-Marie ?
            </span>
          </h2>
          <p className="text-[#17123a]/50 text-lg md:text-xl max-w-2xl font-light">
            La saison sèche (avril – novembre) est idéale. De juillet à octobre,
            c'est le rendez-vous des baleines à bosse.
          </p>
        </div>
        <div className="bg-[#fbfaff] rounded-3xl border border-slate-200 p-8 md:p-12">
          <div className="grid grid-cols-6 md:grid-cols-12 gap-3 mb-8">
            {months.map((m, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="text-xs font-semibold text-[#17123a]/70">
                  {m.name}
                </div>
                <div className="relative w-full h-32 bg-white border border-slate-100 rounded-lg overflow-hidden">
                  <div
                    className="month-bar absolute bottom-0 left-0 right-0 rounded-lg"
                    style={{
                      height: `${m.rain}%`,
                      background: m.recommended
                        ? "linear-gradient(to top,#34d399,#10b981)"
                        : "linear-gradient(to top,#f87171,#ef4444)",
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-500" />
                  <span className="text-xs text-[#17123a]/60">{m.temp}°C</span>
                </div>
                {m.whales ? (
                  <div className="flex items-center gap-1 text-[10px] text-violet-600 font-bold uppercase">
                    <Anchor className="w-3 h-3" /> Baleines
                  </div>
                ) : m.recommended ? (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold uppercase">
                    <Check className="w-3 h-3" /> OK
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] text-rose-500 font-bold uppercase">
                    <X className="w-3 h-3" /> Pluies
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-2 text-sm text-[#17123a]/60">
              <div className="w-4 h-4 rounded bg-gradient-to-t from-emerald-500 to-emerald-400" />
              <span>Recommandé</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#17123a]/60">
              <div className="w-4 h-4 rounded bg-gradient-to-t from-violet-500 to-violet-400" />
              <span>Saison des baleines</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#17123a]/60">
              <div className="w-4 h-4 rounded bg-gradient-to-t from-rose-500 to-rose-400" />
              <span>Saison des pluies</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-slate-200">
            <div className="text-center">
              <Sun className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#17123a]">300</div>
              <div className="text-xs text-[#17123a]/50 uppercase tracking-wider">
                Jours de soleil
              </div>
            </div>
            <div className="text-center">
              <Thermometer className="w-6 h-6 text-rose-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#17123a]">28°C</div>
              <div className="text-xs text-[#17123a]/50 uppercase tracking-wider">
                Moyenne annuelle
              </div>
            </div>
            <div className="text-center">
              <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#17123a]">27°C</div>
              <div className="text-xs text-[#17123a]/50 uppercase tracking-wider">
                Température eau
              </div>
            </div>
            <div className="text-center">
              <Cloud className="w-6 h-6 text-cyan-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-[#17123a]">80%</div>
              <div className="text-xs text-[#17123a]/50 uppercase tracking-wider">
                Humidité
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
