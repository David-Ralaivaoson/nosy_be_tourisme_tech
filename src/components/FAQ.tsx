"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    question: "Combien de jours faut-il pour visiter Nosy Be ?",
    answer:
      "Nous recommandons un minimum de 7 jours pour profiter pleinement de Nosy Be et de ses îles environnantes. Un séjour de 10-14 jours est idéal pour explorer Hell Ville, Nosy Komba, Nosy Tanikely, Lokobe et Nosy Iranja sans se presser.",
  },
  {
    question: "Est-ce que Nosy Be est une destination sûre ?",
    answer:
      "Oui, Nosy Be est considérée comme l'une des destinations les plus sûres de Madagascar. Les touristes sont bien accueillis et les zones touristiques sont sécurisées. Comme partout, il faut prendre des précautions de base.",
  },
  {
    question: "Quel budget prévoir pour un séjour à Nosy Be ?",
    answer:
      "Pour un voyageur en mode backpacker, comptez 40-60€ par jour. Pour un séjour confortable en hôtel 3-4 étoiles avec excursions, prévoyez 120-200€ par jour.",
  },
  {
    question: "Faut-il parler malgache pour voyager à Nosy Be ?",
    answer:
      "Non, le français est largement parlé à Nosy Be, c'est une langue officielle de Madagascar. Vous pourrez communiquer facilement dans les hôtels, restaurants et avec les guides.",
  },
  {
    question: "Quels vaccins sont obligatoires pour Madagascar ?",
    answer:
      "Aucun vaccin n'est obligatoire (sauf fièvre jaune si vous venez d'une zone endémique). Cependant, les vaccins recommandés sont : hépatite A et B, typhoïde, tétanos, et un traitement antipaludéen est fortement conseillé.",
  },
  {
    question: "Peut-on voir des lémuriens à Nosy Be ?",
    answer:
      "Oui ! Nosy Komba (l'île aux lémuriens) est célèbre pour ses lémuriens macaques noirs qui viennent à la rencontre des visiteurs. La réserve de Lokobe abrite également des espèces endémiques.",
  },
];

export function FAQ() {
  const container = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#050505] relative z-20 border-t border-white/5"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
            <HelpCircle className="w-4 h-4 text-violet-400" />
            <span className="text-xs uppercase tracking-widest text-violet-400 font-bold">
              FAQ
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
            Questions{" "}
            <span className="italic font-serif text-violet-400">
              fréquentes
            </span>
          </h2>
          <p className="text-gray-400 text-lg font-light">
            Tout ce que vous devez savoir avant votre voyage à Nosy Be
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="faq-item bg-[#151515] rounded-2xl border border-white/5 overflow-hidden hover:border-violet-500/20 transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 flex items-center justify-between gap-4 text-left group"
              >
                <span className="text-base md:text-lg font-medium group-hover:text-violet-400 transition-colors">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-violet-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 text-white/60 leading-relaxed">
                      {faq.answer}
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
