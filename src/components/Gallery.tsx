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
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    title: "Baie de Nosy Be",
    location: "Hell Ville",
    category: "Paysages",
    span: "col-span-2 row-span-2",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80",
    title: "Lémurien Maki",
    location: "Nosy Komba",
    category: "Faune",
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    title: "Plongée sous-marine",
    location: "Nosy Tanikely",
    category: "Activités",
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
    title: "Plage paradisiaque",
    location: "Amparihy",
    category: "Plages",
    span: "col-span-1 row-span-2",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
    title: "Eaux turquoises",
    location: "Nosy Iranja",
    category: "Plages",
    span: "col-span-1 row-span-1",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=800&q=80",
    title: "Pirogues traditionnelles",
    location: "Hell Ville",
    category: "Culture",
    span: "col-span-2 row-span-1",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    title: "Coucher de soleil",
    location: "Ambatoloaka",
    category: "Paysages",
    span: "col-span-1 row-span-1",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
    title: "Fleurs d'Ylang-Ylang",
    location: "Plantations",
    category: "Nature",
    span: "col-span-1 row-span-1",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80",
    title: "Marché local",
    location: "Hell Ville",
    category: "Culture",
    span: "col-span-2 row-span-1",
  },
];

export function Gallery() {
  const container = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photos)[0] | null>(
    null,
  );
  const [activeFilter, setActiveFilter] = useState("Tous");
  const filters = [
    "Tous",
    "Plages",
    "Faune",
    "Culture",
    "Paysages",
    "Activités",
  ];
  const filteredPhotos =
    activeFilter === "Tous"
      ? photos
      : photos.filter((p) => p.category === activeFilter);

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
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#050505] relative z-20 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
            <Camera className="w-4 h-4 text-violet-400" />
            <span className="text-xs uppercase tracking-widest text-violet-400 font-bold">
              Galerie Photo
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light mb-6 tracking-tight">
            L'île aux parfums{" "}
            <span className="italic font-serif text-violet-400">en images</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Découvrez la beauté envoûtante de Nosy Be à travers notre collection
            de photographies
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeFilter === filter ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30" : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"}`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px]">
          {filteredPhotos.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              className={`gallery-item relative overflow-hidden rounded-xl cursor-pointer group ${photo.span}`}
              onClick={() => setSelectedPhoto(photo)}
              whileHover={{ scale: 0.98 }}
            >
              <img
                src={photo.src}
                alt={photo.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-3 h-3 text-violet-400" />
                  <span className="text-xs text-white/70">
                    {photo.location}
                  </span>
                </div>
                <h3 className="text-white font-semibold">{photo.title}</h3>
                <span className="text-xs text-violet-400 uppercase tracking-wider mt-1">
                  {photo.category}
                </span>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
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
                src={selectedPhoto.src.replace("w=800", "w=1600")}
                alt={selectedPhoto.title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl"
              />
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-light text-white mb-2">
                  {selectedPhoto.title}
                </h3>
                <div className="flex items-center justify-center gap-2 text-white/60">
                  <MapPin className="w-4 h-4 text-violet-400" />
                  <span>{selectedPhoto.location}</span>
                  <span className="text-violet-400">•</span>
                  <span className="uppercase tracking-wider text-xs">
                    {selectedPhoto.category}
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
