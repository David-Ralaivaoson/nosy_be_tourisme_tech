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

  const input =
    "w-full px-4 py-3 bg-[#fbfaff] border border-slate-200 rounded-lg focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all outline-none text-[#17123a] placeholder:text-[#17123a]/35";
  const label =
    "text-xs uppercase tracking-wider text-[#17123a]/55 mb-2 block font-semibold";

  return (
    <section
      ref={container}
      id="contact"
      className="py-32 px-4 md:px-12 lg:px-24 bg-white relative z-20 border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Colonne infos */}
          <div className="contact-content">
            <div className="text-xs uppercase tracking-widest text-violet-600 font-bold mb-4">
              Contactez-nous
            </div>
            <h2 className="text-4xl md:text-5xl font-light mb-6 tracking-tight text-[#17123a]">
              Prêt à partir pour{" "}
              <span className="italic font-serif text-violet-600">
                Sainte-Marie ?
              </span>
            </h2>
            <p className="text-lg text-[#17123a]/60 leading-relaxed mb-10">
              Notre équipe locale est à votre disposition pour créer le voyage
              de vos rêves. Réponse WhatsApp en moins d'1h, devis personnalisé
              en 24h.
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <div className="text-xs text-[#17123a]/45 uppercase tracking-wider mb-1">
                    Email
                  </div>
                  <a
                    href="mailto:contact@sainte-marie-travel.mg"
                    className="text-[#17123a] hover:text-violet-600 transition-colors"
                  >
                    contact@sainte-marie-travel.mg
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <div className="text-xs text-[#17123a]/45 uppercase tracking-wider mb-1">
                    WhatsApp / Téléphone
                  </div>
                  <a
                    href="https://wa.me/261328030046"
                    className="text-[#17123a] hover:text-emerald-600 transition-colors"
                  >
                    +261 32 80 300 46
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-xs text-[#17123a]/45 uppercase tracking-wider mb-1">
                    Adresse
                  </div>
                  <p className="text-[#17123a]">
                    Ambodifotatra
                    <br />
                    Île Sainte-Marie, Madagascar
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne formulaire */}
          <div className="contact-content">
            <form
              onSubmit={handleSubmit}
              className="bg-[#fbfaff] rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Prénom</label>
                  <input
                    type="text"
                    required
                    className={input}
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className={label}>Nom</label>
                  <input
                    type="text"
                    required
                    className={input}
                    placeholder="Dupont"
                  />
                </div>
              </div>
              <div>
                <label className={label}>Email</label>
                <input
                  type="email"
                  required
                  className={input}
                  placeholder="jean@example.com"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={label}>Date de voyage</label>
                  <input type="date" className={input} />
                </div>
                <div>
                  <label className={label}>Personnes</label>
                  <select className={input}>
                    <option value="1">1 personne</option>
                    <option value="2">2 personnes</option>
                    <option value="3-4">3-4 personnes</option>
                    <option value="5+">5+ personnes</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={label}>Votre projet</label>
                <textarea
                  rows={4}
                  className={input + " resize-none"}
                  placeholder="Safari baleines, Île aux Nattes, séjour détente…"
                />
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg font-bold uppercase tracking-wider text-sm text-white flex items-center justify-center gap-2 transition-all disabled:opacity-70 group shadow-lg shadow-violet-500/25"
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
