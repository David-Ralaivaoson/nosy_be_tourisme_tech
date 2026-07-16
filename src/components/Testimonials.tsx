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
    text: "Un voyage absolument magique ! Les plages de Nosy Komba sont à couper le souffle. Notre guide local connaissait chaque recoin de l'île.",
    date: "Mars 2026",
    trip: "Circuit 10 jours",
  },
  {
    name: "Thomas Müller",
    country: "Allemagne 🇩🇪",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
    rating: 5,
    text: "La plongée à Nosy Tanikely est exceptionnelle ! J'ai vu des tortues, des raies et une faune marine incroyable. L'organisation était parfaite.",
    date: "Février 2026",
    trip: "Séjour plongée",
  },
  {
    name: "Sophie Laurent",
    country: "Belgique 🇧🇪",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80",
    rating: 5,
    text: "L'accueil des Sakalava est d'une chaleur incomparable. Nous avons adoré notre nuit chez l'habitant et la découverte des plantations d'ylang-ylang.",
    date: "Janvier 2026",
    trip: "Tourisme culturel",
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
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#0a0a0a] relative z-20 border-t border-white/5 overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="testimonial-header text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20">
            <Quote className="w-4 h-4 text-rose-400" />
            <span className="text-xs uppercase tracking-widest text-rose-400 font-bold">
              Témoignages
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
            Ils ont vécu{" "}
            <span className="italic font-serif text-rose-400">
              l'expérience
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
            Plus de 2 000 voyageurs nous ont fait confiance pour découvrir Nosy
            Be
          </p>
        </div>
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="relative bg-[#151515] rounded-3xl border border-white/5 p-8 md:p-12 shadow-2xl"
        >
          <Quote className="absolute top-6 right-6 w-16 h-16 text-violet-500/10" />
          <div className="flex items-center gap-4 mb-6">
            <img
              src={t.avatar}
              alt={t.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-violet-500/30"
            />
            <div>
              <h3 className="text-lg font-semibold">{t.name}</h3>
              <p className="text-sm text-white/50">{t.country}</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              {[...Array(t.rating)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
          </div>
          <p className="text-lg md:text-xl font-light leading-relaxed text-white/80 mb-8 italic">
            "{t.text}"
          </p>
          <div className="flex flex-wrap items-center gap-4 text-xs text-white/50">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300">
              {t.trip}
            </span>
            <span>•</span>
            <span>{t.date}</span>
          </div>
        </motion.div>
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === current ? "bg-violet-500 w-8" : "bg-white/20"}`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
