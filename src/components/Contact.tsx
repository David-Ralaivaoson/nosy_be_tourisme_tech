"use client";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function Contact() {
  const container = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-content > *",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, container);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section
      ref={container}
      id="contact"
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#0a0a0a] relative z-20 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="contact-content">
            <div className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-4">
              Contactez-nous
            </div>
            <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight">
              Prêt à partir pour{" "}
              <span className="italic font-serif text-violet-400">
                Nosy Be ?
              </span>
            </h2>
            <p className="text-lg text-white/60 leading-relaxed mb-10">
              Notre équipe d'experts locaux est à votre disposition pour créer
              le voyage de vos rêves. Devis personnalisé en 24h.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                    Email
                  </div>
                  <a
                    href="mailto:contact@nosybe-guide.mg"
                    className="text-white hover:text-violet-400 transition-colors"
                  >
                    contact@nosybe-guide.mg
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                    Téléphone
                  </div>
                  <a
                    href="tel:+261341234567"
                    className="text-white hover:text-emerald-400 transition-colors"
                  >
                    +261 34 12 345 67
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-wider mb-1">
                    Adresse
                  </div>
                  <p className="text-white">
                    Rue du Commerce, Hell Ville
                    <br />
                    Nosy Be 207, Madagascar
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="contact-content">
            <form
              onSubmit={handleSubmit}
              className="bg-[#151515] rounded-2xl border border-white/5 p-8 space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/60 mb-2 block">
                    Prénom
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-violet-500/50 focus:bg-white/10 transition-all outline-none"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/60 mb-2 block">
                    Nom
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-violet-500/50 focus:bg-white/10 transition-all outline-none"
                    placeholder="Dupont"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-white/60 mb-2 block">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-violet-500/50 focus:bg-white/10 transition-all outline-none"
                  placeholder="jean@example.com"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/60 mb-2 block">
                    Date de voyage
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-violet-500/50 focus:bg-white/10 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-white/60 mb-2 block">
                    Personnes
                  </label>
                  <select className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-violet-500/50 focus:bg-white/10 transition-all outline-none">
                    <option value="1">1 personne</option>
                    <option value="2">2 personnes</option>
                    <option value="3-4">3-4 personnes</option>
                    <option value="5+">5+ personnes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider text-white/60 mb-2 block">
                  Votre projet
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-violet-500/50 focus:bg-white/10 transition-all outline-none resize-none"
                  placeholder="Parlez-nous de vos envies..."
                />
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 group"
              >
                {submitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Message envoyé !
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Envoyer ma demande
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
