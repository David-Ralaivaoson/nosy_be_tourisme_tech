"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const destinations = [
  {
    title: "Nosy Komba",
    tag: "Île aux Lémuriens",
    color: "from-emerald-500/20 to-teal-500/20",
    image:
      "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80",
    description: "Rencontrez les lémuriens macaques dans leur habitat naturel",
  },
  {
    title: "Nosy Tanikely",
    tag: "Réserve Marine",
    color: "from-blue-500/20 to-cyan-500/20",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    description: "Plongée exceptionnelle parmi tortues et poissons tropicaux",
  },
  {
    title: "Lokobe",
    tag: "Réserve Naturelle",
    color: "from-green-500/20 to-emerald-500/20",
    image:
      "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
    description: "Forêt primaire avec faune et flore endémiques",
  },
  {
    title: "Nosy Iranja",
    tag: "Île paradisiaque",
    color: "from-cyan-500/20 to-blue-500/20",
    image:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
    description: "L'île aux deux bancs de sable reliés à marée basse",
  },
  {
    title: "Hell Ville",
    tag: "Capitale",
    color: "from-rose-500/20 to-pink-500/20",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    description: "Ville coloniale, marché coloré et rue commerçante",
  },
  {
    title: "Amparihy",
    tag: "Plage de rêve",
    color: "from-amber-500/20 to-orange-500/20",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
    description: "Sable blanc et eaux cristallines sur la côte ouest",
  },
];

export function Portfolio() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".portfolio-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );
      gsap.to(".portfolio-card-inner", {
        y: (i: number) => (i % 2 === 0 ? -30 : 30),
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, container);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={container}
      id="destinations"
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#050505] relative z-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-sm uppercase tracking-widest text-violet-400 font-bold mb-4">
            Destinations
          </h2>
          <h3 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
            Lieux{" "}
            <span className="italic font-serif text-violet-400">
              Incontournables
            </span>
          </h3>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
            Découvrez les trésors cachés de Nosy Be, des plages paradisiaques
            aux réserves naturelles préservées.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
          {destinations.map((dest, i) => (
            <div
              key={i}
              className="portfolio-card group relative cursor-pointer"
            >
              <div
                className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${dest.color} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
              />
              <div className="portfolio-card-inner bg-[#151515] border border-white/5 rounded-2xl overflow-hidden relative z-10 transition-transform duration-500 group-hover:-translate-y-2 shadow-2xl">
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs text-white/90">
                    <MapPin className="w-3 h-3 text-violet-400" />
                    {dest.tag}
                  </div>
                </div>
                <div className="p-6 bg-[#1a1a1a]">
                  <h4 className="text-xl font-semibold mb-2 flex items-center justify-between">
                    {dest.title}
                    <ExternalLink className="w-4 h-4 text-white/50 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </h4>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {dest.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
