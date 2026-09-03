"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "Quand voir les baleines à bosse à Sainte-Marie ?",
    answer:
      "De juillet à octobre, avec un pic en août–septembre. Les baleines à bosse viennent se reproduire et mettre bas dans le canal de Sainte-Marie. Nos safaris respectent la charte d'approche officielle.",
  },
  {
    question: "Comment se rendre à Sainte-Marie ?",
    answer:
      "Deux options : vol direct depuis Antananarivo (1h15, aéroport SMS) ou bateau depuis Soanierana-Ivongo (1h30–2h de traversée). Nous organisons vos transferts aéroport ou port vers votre hôtel.",
  },
  {
    question: "Combien de jours prévoir ?",
    answer:
      "5 à 7 jours minimum pour profiter de l'île et de l'Île aux Nattes. 10 jours si vous voulez combiner safari baleines, plongée et farniente sans vous presser.",
  },
  {
    question: "Faut-il louer une voiture sur place ?",
    answer:
      "Non, l'île se découvre à pied, en pirogue, quad, scooter ou tuk-tuk avec chauffeur. L'Île aux Nattes est 100% sans voiture ! Nous proposons toutes ces locations dans le configurateur de devis.",
  },
  {
    question: "L'île est-elle sûre ?",
    answer:
      "Oui, Sainte-Marie est une destination tranquille et accueillante. Comme partout, gardez les précautions de base avec vos objets de valeur.",
  },
  {
    question: "Quel budget prévoir ?",
    answer:
      "Comptez 40–60€/jour en mode backpacker, 100–180€/jour pour un séjour confortable avec hébergement en lodge et excursions. Le devis en ligne vous donne le total exact en Ariary en 2 minutes.",
  },
];

export function FAQ() {
  const container = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(0);
  useEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
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
      className="py-32 px-4 md:px-12 lg:px-24 bg-white relative z-20 border-t border-slate-100"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-violet-50 border border-violet-200">
            <HelpCircle className="w-4 h-4 text-violet-600" />
            <span className="text-xs uppercase tracking-widest text-violet-700 font-bold">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-[#17123a]">
            Questions{" "}
            <span className="italic font-serif text-violet-600">
              fréquentes
            </span>
          </h2>
          <p className="text-[#17123a]/50 text-lg font-light">
            Tout ce qu'il faut savoir avant votre voyage à Sainte-Marie
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="faq-item bg-[#fbfaff] rounded-2xl border border-slate-200 overflow-hidden hover:border-violet-200 transition-all"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full p-6 flex items-center justify-between gap-4 text-left group"
              >
                <span className="text-base md:text-lg font-medium text-[#17123a] group-hover:text-violet-700 transition-colors">
                  {f.question}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-violet-600" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-[#17123a]/60 leading-relaxed">
                      {f.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
