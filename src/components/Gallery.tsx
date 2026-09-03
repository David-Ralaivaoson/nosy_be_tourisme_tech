"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, ZoomIn, Camera, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
gsap.registerPlugin(ScrollTrigger);

const photos = [
  {
    id: 1,
    src: "/textures/sainte-marie-hero.png",
    title: "Sanctuaire des baleines",
    location: "Canal de Sainte-Marie",
    category: "Paysages",
    span: "col-span-2 row-span-2",
  },
  {
    id: 2,
    src: "/textures/sainte-marie-activites.jpg",
    title: "Safari baleines",
    location: "Baie des baleines",
    category: "Activités",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    title: "Plongée sous-marine",
    location: "Récifs coralliens",
    category: "Activités",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    src: "/textures/sainte-marie-plages.jpg",
    title: "Pirogues traditionnelles",
    location: "Île aux Nattes",
    category: "Plages",
    span: "col-span-1 row-span-2",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
    title: "Eaux turquoises",
    location: "Piscines naturelles",
    category: "Plages",
    span: "col-span-1 row-span-1",
  },
  {
    id: 6,
    src: "/decor/cove.jpg",
    title: "Crique verdoyante",
    location: "Côte ouest",
    category: "Paysages",
    span: "col-span-2 row-span-1",
  },
  {
    id: 7,
    src: "/textures/sainte-marie-coucher.jpg",
    title: "Coucher de soleil",
    location: "Île aux Nattes",
    category: "Paysages",
    span: "col-span-1 row-span-1",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    title: "Marché local",
    location: "Ambodifotatra",
    category: "Culture",
    span: "col-span-2 row-span-1",
  },
];

export function Gallery() {
  const container = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<(typeof photos)[0] | null>(null);
  const [filter, setFilter] = useState("Tous");
  const filters = ["Tous", "Plages", "Paysages", "Culture", "Activités"];
  const shown =
    filter === "Tous" ? photos : photos.filter((p) => p.category === filter);

  useEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gallery-item",
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
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
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#fbfaff] relative z-20 border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-violet-50 border border-violet-200">
            <Camera className="w-4 h-4 text-violet-600" />
            <span className="text-xs uppercase tracking-widest text-violet-700 font-bold">
              Galerie Photo
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light mb-6 tracking-tight text-[#17123a]">
            L'île aux baleines{" "}
            <span className="italic font-serif text-violet-600">en images</span>
          </h2>
          <p className="text-[#17123a]/50 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Découvrez la beauté de Sainte-Marie à travers notre collection de
            photographies.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${filter === f ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/30" : "bg-white border border-slate-200 text-[#17123a]/55 hover:bg-slate-50"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {shown.map((p) => (
            <motion.div
              key={p.id}
              layout
              className={`gallery-item relative overflow-hidden rounded-xl cursor-pointer group ${p.span}`}
              onClick={() => setSelected(p)}
              whileHover={{ scale: 0.98 }}
            >
              <img
                src={p.src}
                alt={p.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3 h-3 text-violet-300" />
                  <span className="text-xs text-white/80">{p.location}</span>
                </div>
                <h3 className="text-white font-semibold">{p.title}</h3>
                <span className="text-xs text-violet-300 uppercase tracking-wider mt-1">
                  {p.category}
                </span>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                <ZoomIn className="w-4 h-4 text-[#17123a]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-[#0c0a17]/92 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center"
              onClick={() => setSelected(null)}
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selected.src}
                alt={selected.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
              />
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-light text-white mb-2">
                  {selected.title}
                </h3>
                <div className="flex items-center justify-center gap-2 text-white/60">
                  <MapPin className="w-4 h-4 text-violet-400" />
                  <span>{selected.location}</span>
                  <span className="text-violet-400">•</span>
                  <span className="uppercase tracking-wider text-xs">
                    {selected.category}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
