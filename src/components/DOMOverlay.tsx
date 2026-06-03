// src/components/DOMOverlay.tsx
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export function DOMOverlay() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#scroll-wrapper",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // SCENE 1 → fade out
    tl.to(
      ".scene-1-text",
      { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" },
      0.7,
    );

    // SCENE 2 → droite
    tl.fromTo(
      ".scene-2-text",
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
      1,
    );
    tl.to(
      ".scene-2-text",
      { opacity: 0, x: 60, duration: 0.4, ease: "power2.in" },
      1.7,
    );

    // SCENE 3 → gauche
    tl.fromTo(
      ".scene-3-text",
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 0.5, ease: "power3.out" },
      2,
    );
    tl.to(
      ".scene-3-text",
      { opacity: 0, x: -60, duration: 0.4, ease: "power2.in" },
      2.7,
    );

    // SCENE 4 → bas
    tl.fromTo(
      ".scene-4-text",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      3,
    );
    tl.to(
      ".scene-4-text",
      { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" },
      3.8,
    );

    // SCENE 5 → overlay noir
    tl.to(
      ".scene-5-overlay",
      { opacity: 1, duration: 0.8, ease: "power2.in" },
      4.2,
    );
  }); // ← PAS de { scope: container } pour que les classes globales fonctionnent

  return (
    <div id="scroll-wrapper" className="h-[600vh] w-full relative">
      <div
        ref={container}
        className="sticky top-0 h-screen w-full overflow-hidden text-white pointer-events-none"
      >
        {/* SCENE 1 */}
        <div className="scene-1-text absolute inset-0 flex flex-col items-center justify-center z-20 px-8">
          <p className="text-xs font-bold uppercase tracking-[0.5em] text-blue-400 mb-4">
            Studio Digital d'Exception
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-center leading-[0.95] mb-6">
            Solutions{" "}
            <span className="italic font-serif text-violet-400">digitales</span>
            <br />
            <span className="font-black uppercase tracking-tighter">
              sur mesure.
            </span>
          </h1>
          <p className="text-white/40 text-lg font-light">
            Scroll pour explorer →
          </p>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <div className="h-16 w-px bg-linear-to-b from-transparent to-white/50"></div>
            <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
              Scroll
            </p>
          </div>
        </div>

        {/* SCENE 2 — droite */}
        <div className="scene-2-text absolute inset-0 flex items-center justify-end z-20 px-8 md:px-20 opacity-0">
          <div className="max-w-md text-right">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-violet-400 mb-3">
              01 — Solutions Web
            </p>
            <h2 className="text-4xl md:text-5xl font-light leading-none mb-5">
              Sites web{" "}
              <span className="font-black block">haute performance.</span>
            </h2>
            <p className="text-white/50 text-lg font-light leading-relaxed mb-6">
              Des interfaces immersives pensées pour convertir, avec des
              animations fluides et une UX irréprochable.
            </p>
            <div className="flex flex-col gap-2 items-end">
              {["Next.js", "React", "Three.js", "GSAP"].map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-1 rounded-full border border-violet-500/30 text-xs font-bold uppercase tracking-widest text-violet-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SCENE 3 — gauche */}
        <div className="scene-3-text absolute inset-0 flex items-center justify-start z-20 px-8 md:px-20 opacity-0">
          <div className="max-w-md text-left">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-blue-400 mb-3">
              02 — Applications Mobile
            </p>
            <h2 className="text-4xl md:text-5xl font-light leading-none mb-5">
              <span className="font-black block">Scalable.</span>
              <span className="italic font-serif text-blue-400">Élégant.</span>
              <span className="block">Puissant.</span>
            </h2>
            <p className="text-white/50 text-lg font-light leading-relaxed mb-6">
              Des dashboards et applications mobiles sur mesure, conçus pour les
              entreprises en croissance.
            </p>
            <div className="flex flex-col gap-2">
              {["React Native", "TypeScript", "Supabase", "Stripe"].map(
                (tech) => (
                  <span
                    key={tech}
                    className="px-4 py-1 rounded-full border border-blue-500/30 text-xs font-bold uppercase tracking-widest text-blue-400 w-fit"
                  >
                    {tech}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* SCENE 4 — bas */}
        <div className="scene-4-text absolute bottom-16 left-0 right-0 flex justify-center z-20 opacity-0 px-8">
          <div className="max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-emerald-400 mb-3">
              03 — Résultats
            </p>
            <h2 className="text-3xl md:text-4xl font-light leading-[1.1] mb-4">
              <span className="font-black">+200 projets</span> livrés.{" "}
              <span className="italic font-serif text-emerald-400">
                99.9% uptime.
              </span>
            </h2>
            <p className="text-white/40 font-light text-base">
              Des solutions robustes qui perdurent dans le temps.
            </p>
          </div>
        </div>

        {/* SCENE 5 — overlay fermeture */}
        <div className="scene-5-overlay absolute inset-0 bg-[#050505] opacity-0 z-30 pointer-events-none"></div>
      </div>
    </div>
  );
}
