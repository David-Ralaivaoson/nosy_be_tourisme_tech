"use client";
import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Menu, X, ChevronDown } from "lucide-react";
import { CustomCursor } from "@/src/components/CustomCursor";
import { LaptopScene } from "@/src/components/3d/LaptopScene";
import { Portfolio } from "@/src/components/Portfolio";
import { Company } from "@/src/components/Company";
import { NeuralBackground } from "@/src/components/3d/NeuralBackground";
import { SceneTexts } from "@/src/components/3d/SceneTexts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NavbarMenu } from "@/src/components/Shared/Navbar-menu";
import { Gallery } from "@/src/components/Gallery";
import { Accommodations } from "@/src/components/Accommodations";
import { Gastronomy } from "@/src/components/Gastronomy";
import { Testimonials } from "@/src/components/Testimonials";
import { BestTime } from "@/src/components/BestTime";
import { PracticalInfo } from "@/src/components/PracticalInfo";
import { FAQ } from "@/src/components/FAQ";
import { Contact } from "@/src/components/Contact";
import { Footer } from "@/src/components/Shared/Footer";

gsap.registerPlugin(ScrollTrigger);

interface NavLink {
  label: string;
  href: string;
  submenu?: { label: string; href: string }[];
}

const navLinks: NavLink[] = [
  {
    label: "Destinations",
    href: "#destinations",
    submenu: [
      { label: "Nosy Komba", href: "#nosy-komba" },
      { label: "Nosy Tanikely", href: "#nosy-tanikely" },
      { label: "Lokobe", href: "#lokobe" },
    ],
  },
  {
    label: "Activités",
    href: "#activites",
    submenu: [
      { label: "Plongée", href: "#plongee" },
      { label: "Snorkeling", href: "#snorkeling" },
      { label: "Excursions", href: "#excursions" },
    ],
  },
  {
    label: "Hébergements",
    href: "#hebergements",
    submenu: [
      { label: "Lodges", href: "#lodges" },
      { label: "Hôtels", href: "#hotels" },
      { label: "Bungalows", href: "#bungalows" },
    ],
  },
  { label: "Contact", href: "#contact" },
];

function NavigationMenu() {
  const [openMobile, setOpenMobile] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleMenuItemClick = () => setOpenMobile(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMobile(false);
      }
    };
    if (openMobile) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMobile]);

  return (
    <>
      <nav className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 z-200">
        <TooltipProvider>
          {navLinks.map((link, idx) => (
            <div key={idx}>
              {link.submenu ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <button className="flex items-center gap-2 group relative overflow-hidden px-3 py-2 rounded-lg hover:bg-violet-500/10 transition-all duration-300">
                      <span className="relative z-10 text-white group-hover:text-violet-400 transition-colors duration-300">
                        {link.label}
                      </span>
                      <ChevronDown className="w-3 h-3 text-white/60 group-hover:text-violet-400 group-hover:rotate-180 transition-all duration-300" />
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-slate-900/95 border border-violet-500/30 rounded-xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-300">
                    {link.submenu.map((subitem, sidx) => (
                      <DropdownMenuItem
                        key={sidx}
                        className="cursor-pointer text-xs text-white/70 hover:text-violet-400 focus:text-violet-400 hover:bg-violet-500/20 transition-all duration-200"
                      >
                        <a href={subitem.href} className="w-full">
                          {subitem.label}
                        </a>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Tooltip>
                  <TooltipTrigger>
                    <a
                      href={link.href}
                      className={`group relative px-3 py-2 rounded-lg overflow-hidden transition-all duration-300 ${link.label === "Contact" ? "hover:text-violet-400 text-white underline underline-offset-8 decoration-violet-500" : "text-white hover:text-violet-400"}`}
                    >
                      <span className="relative z-10">{link.label}</span>
                      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-violet-500/0 via-violet-500/10 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-violet-400 to-violet-600 group-hover:w-full transition-all duration-500" />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="bg-slate-900 border border-violet-500/30 text-white text-xs rounded-lg backdrop-blur-xl">
                    <p>Aller à {link.label}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ))}
        </TooltipProvider>
      </nav>

      <button
        onClick={() => setOpenMobile(!openMobile)}
        className="md:hidden relative z-200 p-2 hover:bg-violet-500/20 rounded-lg transition-all duration-300"
        aria-label="Toggle menu"
      >
        {openMobile ? (
          <X className="w-5 h-5 text-white" />
        ) : (
          <Menu className="w-5 h-5 text-white" />
        )}
      </button>

      {openMobile && (
        <div
          ref={menuRef}
          className="absolute top-20 left-0 right-0 md:hidden bg-slate-900/95 backdrop-blur-xl border-b border-violet-500/30 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex flex-col p-4 space-y-2">
            <TooltipProvider>
              {navLinks.map((link, idx) => (
                <div key={idx}>
                  {link.submenu ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-violet-500/20 text-white text-sm font-semibold uppercase tracking-wider transition-all duration-300 group">
                          <span className="group-hover:text-violet-400 transition-colors">
                            {link.label}
                          </span>
                          <ChevronDown className="w-4 h-4 group-hover:text-violet-400 group-hover:rotate-180 transition-all" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-800/95 border border-violet-500/30 rounded-xl backdrop-blur-xl w-[calc(100vw-2rem)]">
                        {link.submenu.map((subitem, sidx) => (
                          <DropdownMenuItem
                            key={sidx}
                            onClick={handleMenuItemClick}
                            className="cursor-pointer text-sm text-white/70 hover:text-violet-400 focus:text-violet-400 hover:bg-violet-500/20 transition-all duration-200"
                          >
                            <a href={subitem.href} className="w-full">
                              {subitem.label}
                            </a>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <a
                      href={link.href}
                      onClick={handleMenuItemClick}
                      className="block w-full px-4 py-3 rounded-lg hover:bg-violet-500/20 text-white text-sm font-semibold uppercase tracking-wider transition-all duration-300 group"
                    >
                      <span className="group-hover:text-violet-400 transition-colors">
                        {link.label}
                      </span>
                    </a>
                  )}
                </div>
              ))}
            </TooltipProvider>
          </div>
        </div>
      )}
    </>
  );
}

export default function Home() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.0, // Plus réactif que 1.2
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      smoothWheel: true,
    });

    // Fonction nommée pour un nettoyage propre du ticker (évite les fuites en React 18 Strict Mode)
    const onRaf = (time: number) => {
      lenis.raf(time * 1000);
    };

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(onRaf);

    // ✅ Fonction wrapper pour satisfaire le typage EventListener de TypeScript
    const handleRefresh = () => {
      ScrollTrigger.refresh();
    };

    // Refresh initial après chargement du layout
    const refreshTimer = setTimeout(() => {
      handleRefresh();
    }, 500);

    window.addEventListener("resize", handleRefresh);
    window.addEventListener("load", handleRefresh);

    return () => {
      clearTimeout(refreshTimer);
      gsap.ticker.remove(onRaf); // ✅ Nettoyage parfait
      window.removeEventListener("resize", handleRefresh);
      window.removeEventListener("load", handleRefresh);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      ref={container}
      className="relative w-full bg-[#050505] text-white selection:bg-violet-500/30 overflow-hidden font-sans"
    >
      {/* <CustomCursor /> */}
      <NeuralBackground />
      <SceneTexts />

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

      <div className="fixed top-0 left-0 w-full z-100 pointer-events-none">
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>
      <nav className="fixed top-0 left-0 w-full px-6 py-2 md:px-8 flex justify-between items-center pointer-events-auto z-100">
        <div className="flex items-center gap-2 size-16">
          <img
            src="/logo/icon_MD.png"
            alt=""
            className="size-16 object-contain"
          />
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-white/80">
            Nosy Be Guide
          </div>
        </div>
        <NavbarMenu />
      </nav>

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

      <div
        id="scroll-wrapper"
        className="h-[600vh] w-full relative pointer-events-none"
      />

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
