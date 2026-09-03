"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    name: "Marie Dubois",
    country: "France 🇫🇷",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
    rating: 5,
    text: "Un voyage absolument magique ! Le safari baleines était incroyable : une mère et son baleineau à quelques mètres du bateau. Équipe attentionnée et professionnelle.",
    date: "Août 2026",
    trip: "Safari baleines",
  },
  {
    name: "Thomas Müller",
    country: "Allemagne 🇩🇪",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
    rating: 5,
    text: "L'Île aux Nattes est un paradis sur terre. Plages désertes, eaux cristallines, langoustes grillées... Un rêve éveillé, organisation parfaite.",
    date: "Juillet 2026",
    trip: "Île aux Nattes",
  },
  {
    name: "Sophie Laurent",
    country: "Belgique 🇧🇪",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80",
    rating: 5,
    text: "Transferts ponctuels, hôtel magnifique, excursions bien organisées. Le devis en ligne avec PDF reçu en 2 minutes : très professionnel !",
    date: "Septembre 2026",
    trip: "Séjour complet",
  },
];

export function Testimonials() {
  const container = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () =>
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".testimonial-header",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
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

  const t = testimonials[current];
  return (
    <section
      ref={container}
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#fbfaff] relative z-20 border-t border-slate-100 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-100/60 blur-[120px] pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="testimonial-header text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-rose-50 border border-rose-200">
            <Quote className="w-4 h-4 text-rose-500" />
            <span className="text-xs uppercase tracking-widest text-rose-600 font-bold">
              Témoignages
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-[#17123a]">
            Ils ont vécu{" "}
            <span className="italic font-serif text-rose-500">
              l'expérience
            </span>
          </h2>
          <p className="text-[#17123a]/50 text-lg max-w-2xl mx-auto font-light">
            Des centaines de voyageurs nous font confiance chaque saison pour
            découvrir Sainte-Marie.
          </p>
        </div>
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-xl shadow-violet-950/5"
        >
          <Quote className="absolute top-6 right-6 w-16 h-16 text-violet-100" />
          <div className="flex items-center gap-4 mb-6">
            <img
              src={t.avatar}
              alt={t.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-violet-200"
            />
            <div>
              <h3 className="text-lg font-semibold text-[#17123a]">{t.name}</h3>
              <p className="text-sm text-[#17123a]/50">{t.country}</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {[...Array(t.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
          </div>
          <p className="text-lg md:text-xl font-light leading-relaxed text-[#17123a]/80 mb-8 italic">
            "{t.text}"
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#17123a]/50">
            <span className="px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700">
              {t.trip}
            </span>
            <span>•</span>
            <span>{t.date}</span>
          </div>
        </motion.div>
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full bg-white hover:bg-violet-50 border border-slate-200 flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-[#17123a]" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all ${i === current ? "bg-violet-600 w-8" : "bg-slate-200 w-2"}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-12 h-12 rounded-full bg-white hover:bg-violet-50 border border-slate-200 flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-5 h-5 text-[#17123a]" />
          </button>
        </div>
      </div>
    </section>
  );
}
