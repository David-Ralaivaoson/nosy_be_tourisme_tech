"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, MapPin } from "lucide-react";
gsap.registerPlugin(ScrollTrigger);

const destinations = [
  {
    title: "Île aux Nattes",
    tag: "Paradis préservé",
    color: "from-emerald-100 to-teal-100",
    image: "/decor/cove.jpg",
    description:
      "Plages désertes, pas de voitures, langoustes grillées au coucher du soleil.",
  },
  {
    title: "Safari Baleines",
    tag: "Juillet – Octobre",
    color: "from-violet-100 to-indigo-100",
    image: "/textures/sainte-marie-activites.jpg",
    description:
      "Observez les baleines à bosse et leurs baleineaux dans le sanctuaire.",
  },
  {
    title: "Baie d'Ampanihy",
    tag: "Eaux turquoises",
    color: "from-cyan-100 to-blue-100",
    image: "/textures/sainte-marie-plages.jpg",
    description: "Pirogues traditionnelles, sable blanc et récifs coralliens.",
  },
  {
    title: "Piscines Naturelles",
    tag: "Bassins coralliens",
    color: "from-blue-100 to-cyan-100",
    image:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
    description:
      "Baignade calme dans des bassins turquoise protégés des vagues.",
  },
  {
    title: "Ambodifotatra",
    tag: "Ville principale",
    color: "from-rose-100 to-pink-100",
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    description: "Marché coloré, port animé et vie locale authentique.",
  },
  {
    title: "Cimetière des Pirates",
    tag: "Histoire & légendes",
    color: "from-amber-100 to-orange-100",
    image: "/textures/sainte-marie-coucher.jpg",
    description:
      "Sainte-Marie, repaire de flibustiers aux XVIIe–XVIIIe siècles.",
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
      className="py-32 px-4 md:px-12 lg:px-24 bg-white relative z-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-sm uppercase tracking-widest text-violet-600 font-bold mb-4">
            Destinations
          </h2>
          <h3 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-[#17123a]">
            Lieux{" "}
            <span className="italic font-serif text-violet-600">
              Incontournables
            </span>
          </h3>
          <p className="text-[#17123a]/50 text-lg md:text-xl max-w-2xl font-light">
            Découvrez les trésors de Sainte-Marie, du sanctuaire des baleines
            aux îlots préservés.
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
              <div className="portfolio-card-inner bg-white border border-slate-200 rounded-2xl overflow-hidden relative z-10 transition-all duration-500 group-hover:-translate-y-2 shadow-sm group-hover:shadow-2xl group-hover:shadow-violet-950/10 group-hover:border-violet-200">
                <div className="h-64 relative overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm text-xs text-[#17123a]/80 shadow-sm">
                    <MapPin className="w-3 h-3 text-violet-600" />
                    {dest.tag}
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <h4 className="text-xl font-semibold mb-2 flex items-center justify-between text-[#17123a]">
                    {dest.title}
                    <ExternalLink className="w-4 h-4 text-[#17123a]/30 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </h4>
                  <p className="text-sm text-[#17123a]/55 leading-relaxed">
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
