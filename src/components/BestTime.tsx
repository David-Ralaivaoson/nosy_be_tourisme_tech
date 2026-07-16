"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Thermometer, Check, X, Sun, Droplets, Cloud } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const months = [
  { name: "Jan", temp: 30, rain: 85, recommended: false },
  { name: "Fév", temp: 30, rain: 80, recommended: false },
  { name: "Mar", temp: 30, rain: 70, recommended: false },
  { name: "Avr", temp: 29, rain: 45, recommended: true },
  { name: "Mai", temp: 28, rain: 25, recommended: true },
  { name: "Juin", temp: 27, rain: 15, recommended: true },
  { name: "Juil", temp: 26, rain: 10, recommended: true },
  { name: "Août", temp: 26, rain: 10, recommended: true },
  { name: "Sep", temp: 27, rain: 15, recommended: true },
  { name: "Oct", temp: 28, rain: 25, recommended: true },
  { name: "Nov", temp: 29, rain: 45, recommended: true },
  { name: "Déc", temp: 30, rain: 75, recommended: false },
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
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#0a0a0a] relative z-20 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-4">
            Meilleure Période
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
            Quand partir à{" "}
            <span className="italic font-serif text-amber-400">Nosy Be ?</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
            La saison sèche, d'avril à novembre, offre les meilleures conditions
            pour profiter de l'île.
          </p>
        </div>
        <div className="bg-[#151515] rounded-3xl border border-white/5 p-8 md:p-12">
          <div className="grid grid-cols-6 md:grid-cols-12 gap-3 mb-8">
            {months.map((month, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="text-xs font-semibold text-white/70">
                  {month.name}
                </div>
                <div className="relative w-full h-32 bg-white/5 rounded-lg overflow-hidden">
                  <div
                    className="month-bar absolute bottom-0 left-0 right-0 rounded-lg"
                    style={{
                      height: `${month.rain}%`,
                      background: month.recommended
                        ? "linear-gradient(to top, #34d399, #10b981)"
                        : "linear-gradient(to top, #f87171, #ef4444)",
                    }}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-amber-400" />
                  <span className="text-xs text-white/60">{month.temp}°C</span>
                </div>
                {month.recommended ? (
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase">
                    <Check className="w-3 h-3" />
                    OK
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] text-rose-400 font-bold uppercase">
                    <X className="w-3 h-3" />
                    Pluies
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <div className="w-4 h-4 rounded bg-gradient-to-t from-emerald-500 to-emerald-400" />
              <span>Recommandé</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <div className="w-4 h-4 rounded bg-gradient-to-t from-rose-500 to-rose-400" />
              <span>Saison des pluies</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>Température moyenne</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-8 border-t border-white/5">
            <div className="text-center">
              <Sun className="w-6 h-6 text-amber-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">300</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">
                Jours de soleil
              </div>
            </div>
            <div className="text-center">
              <Thermometer className="w-6 h-6 text-rose-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">28°C</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">
                Moyenne annuelle
              </div>
            </div>
            <div className="text-center">
              <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">27°C</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">
                Température eau
              </div>
            </div>
            <div className="text-center">
              <Cloud className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-bold">80%</div>
              <div className="text-xs text-white/50 uppercase tracking-wider">
                Humidité
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
