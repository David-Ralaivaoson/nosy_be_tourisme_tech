// app/page.tsx
"use client";
import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { CustomCursor } from "@/src/components/CustomCursor";
import { LaptopScene, SceneTexts } from "@/src/components/3d/LaptopScene";
import { Portfolio } from "@/src/components/Portfolio";
import { Company } from "@/src/components/Company";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => ScrollTrigger.refresh(), 100);
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    return () => {
      gsap.ticker.remove(lenis.raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      ref={container}
      className="relative w-full bg-[#050505] text-white selection:bg-violet-500/30 overflow-hidden font-sans"
    >
      <CustomCursor />

      {/*
        SceneTexts : composant HTML normal monté ICI, hors du Canvas.
        Il injecte les divs de scène dans <body> via createPortal.
        GSAP les anime depuis LaptopScene via les classes .scene-X-text.
      */}
      <SceneTexts />

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-125 h-125 bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-blue-900/20 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'url(\'data:image/svg+xml,%3Csvg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%25" height="100%25" filter="url(%23noiseFilter)"/%3E%3C/svg%3E\')',
          }}
        />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 w-full p-6 md:p-8 flex justify-between items-center z-50 pointer-events-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-linear-to-tr from-violet-600 to-blue-500 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
          </div>
          <span className="font-bold tracking-tight text-xl">
            LUMINA<span className="text-violet-500">STUDIO</span>
          </span>
        </div>
        <div className="hidden md:flex gap-10 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
          <a
            href="#"
            className="text-white hover:text-violet-400 transition-colors"
          >
            Solutions
          </a>
          <a href="#" className="hover:text-violet-400 transition-colors">
            Portfolio
          </a>
          <a href="#" className="hover:text-violet-400 transition-colors">
            Studio
          </a>
          <a
            href="#"
            className="hover:text-violet-400 transition-colors underline underline-offset-8 decoration-violet-500"
          >
            Contact
          </a>
        </div>
      </nav>

      {/* Canvas 3D — z-0, derrière tout */}
      <div
        id="canvas-container"
        className="fixed inset-0 z-0 pointer-events-none opacity-0"
      >
        <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }} dpr={[1, 2]}>
          <ambientLight intensity={1.5} />
          <directionalLight
            position={[5, 10, 5]}
            intensity={2}
            color="#ffffff"
          />
          <directionalLight
            position={[-5, -10, -5]}
            intensity={0.5}
            color="#6d28d9"
          />
          {/* LaptopScene = Three.js uniquement, aucun HTML */}
          <LaptopScene />
          <ContactShadows
            position={[0, -2, 0]}
            opacity={0.6}
            scale={20}
            blur={2.5}
            far={4}
            color="#000000"
          />
        </Canvas>
      </div>

      {/* Scroll wrapper pour GSAP ScrollTrigger — doit exister dans le DOM */}
      <div
        id="scroll-wrapper"
        className="h-[600vh] w-full relative pointer-events-none"
      />

      {/* Sections normales */}
      <div className="relative z-20 w-full pointer-events-auto">
        <Portfolio />
        <Company />
      </div>
    </div>
  );
}
