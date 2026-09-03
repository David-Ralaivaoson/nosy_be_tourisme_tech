"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { LaptopScene } from "@/src/components/3d/LaptopScene";
import { NeuralBackground } from "@/src/components/3d/NeuralBackground";
import { SceneTexts } from "@/src/components/3d/SceneTexts";
import { Portfolio } from "@/src/components/Portfolio";
import { Gallery } from "@/src/components/Gallery";
import { Company } from "@/src/components/Company";
import { Accommodations } from "@/src/components/Accommodations";
import { Gastronomy } from "@/src/components/Gastronomy";
import { Testimonials } from "@/src/components/Testimonials";
import { BestTime } from "@/src/components/BestTime";
import { PracticalInfo } from "@/src/components/PracticalInfo";
import { FAQ } from "@/src/components/FAQ";
import { Contact } from "@/src/components/Contact";
import { Footer } from "@/src/components/shared/Footer";
import WaveHeroImage from "@/src/components/hebergements/WaveHeroImage";
import dynamic from "next/dynamic";
import LaptopPlaceholder from "@/src/components/3d/LaptopPlaceholder";
import CoveImage from "@/src/components/home/CoveImage";

gsap.registerPlugin(ScrollTrigger);

// Lazy load du Canvas (ne charge pas three.js tant que pas visible)
const LazyCanvas = dynamic(
  () => import("@react-three/fiber").then((mod) => mod.Canvas),
  { ssr: false },
);

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const [shouldLoad3D, setShouldLoad3D] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    const onRaf = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(onRaf);
    const refresh = () => ScrollTrigger.refresh();
    const t = setTimeout(refresh, 500);
    window.addEventListener("resize", refresh);
    window.addEventListener("load", refresh);
    return () => {
      clearTimeout(t);
      gsap.ticker.remove(onRaf);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("load", refresh);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    // Ne charge le 3D que si connexion rapide + desktop
    const connection = (navigator as any).connection;
    const isSlow =
      connection &&
      (connection.effectiveType === "2g" ||
        connection.effectiveType === "slow-2g" ||
        connection.saveData);

    const isMobileDevice = window.innerWidth < 768;

    setShouldLoad3D(!isSlow && !isMobileDevice);
  }, []);

  // Dans le JSX :
  {
    shouldLoad3D && (
      <Suspense fallback={<LaptopPlaceholder />}>
        {/* Canvas + LaptopScene */}
      </Suspense>
    );
  }

  return (
    <div
      ref={container}
      className="relative w-full bg-[#fbfaff] text-[#17123a] selection:bg-violet-200 overflow-hidden font-sans"
    >
      <NeuralBackground />
      <SceneTexts />

      {/* Halos pastel */}
      <div className="absolute inset-x-0 top-0 h-[120vh] z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-200/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/50 rounded-full blur-[150px]" />
      </div>

      {/* Crique organique à droite (comme la référence) */}
      {/* <div className="absolute top-[24vh] right-[-2vw] z-[5] w-[42vw] max-w-[680px] aspect-[4/3] pointer-events-none hidden md:block">
        <WaveHeroImage  src="/decor/cove.jpg" alt="Crique organique" />
      </div> */}

      {/* Feuille monstera en bas à gauche */}
      <div className="absolute top-[50vh] rotate-[0deg] left-[-40px] z-[5] w-[240px] md:w-[340px] pointer-events-none mix-blend-multiply opacity-90">
        <img src="/decor/leaf.webp" alt="" className="w-full" />
      </div>

      <CoveImage />

      {/* Scène 3D */}
      <div
        id="canvas-container"
        className="fixed inset-0 z-0 pointer-events-none opacity-0"
      >
        <Suspense fallback={<LaptopPlaceholder />}>
          {LazyCanvas && (
            <LazyCanvas
              camera={{ position: [0, 0, 8.5], fov: 45 }}
              dpr={isMobile ? [1, 1.25] : [1, 1.5]}
            >
              <ambientLight intensity={2.0} />
              <directionalLight
                position={[5, 10, 5]}
                intensity={1.6}
                color="#ffffff"
              />
              <directionalLight
                position={[-5, -10, -5]}
                intensity={0.4}
                color="#e9defc"
              />
              {/* Lumière frontale plus haute et plus douce : son reflet part vers le bas,
    hors de l'axe caméra → plus de point chaud sur la dalle */}
              <directionalLight
                position={[0, 9, 3]}
                intensity={0.5}
                color="#ffffff"
              />
              <LaptopScene />
              <ContactShadows
                position={[0, -2, 0]}
                opacity={0.22}
                scale={15} // ↓ au lieu de 20
                blur={2.5} // ↓ au lieu de 2.8
                far={3} // ↓ au lieu de 4
                color="#3b2a6b"
                resolution={256} // ↓ résolution des ombres (défaut 512)
              />
            </LazyCanvas>
          )}
        </Suspense>
      </div>

      <div
        id="scroll-wrapper"
        className="h-[600vh] w-full relative pointer-events-none"
      />

      {/* Sections claires */}
      <div className="relative z-20 w-full pointer-events-auto">
        <Portfolio />
        <Gallery />
        <Company />
        <Accommodations />
        <Gastronomy />
        <Testimonials />
        <BestTime />
        <PracticalInfo />
        <FAQ />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}
