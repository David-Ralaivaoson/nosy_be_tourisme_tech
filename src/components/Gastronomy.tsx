"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Utensils, Leaf, Fish, Wine, Coffee } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const dishes = [
  {
    name: "Romazava",
    description:
      "Ragoût traditionnel de brèdes (feuilles vertes) mijotées avec du zébu, tomates et gingembre. Plat national malgache.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    icon: Utensils,
    color: "from-amber-500/20 to-orange-500/20",
    tag: "Plat National",
  },
  {
    name: "Ravitoto",
    description:
      "Feuilles de manioc pilées et mijotées avec du porc, ail et lait de coco. Spécialité sakalava de Nosy Be.",
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80",
    icon: Leaf,
    color: "from-green-500/20 to-emerald-500/20",
    tag: "Spécialité Locale",
  },
  {
    name: "Lasary",
    description:
      "Salade de légumes frais (tomates, oignons, concombres) avec citron vert, piment et huile. Accompagnement typique.",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    icon: Leaf,
    color: "from-blue-500/20 to-cyan-500/20",
    tag: "Frais",
  },
  {
    name: "Langoustes Grillées",
    description:
      "Langoustes fraîches pêchées localement, grillées au feu de bois avec ail, citron et beurre. Spécialité de Nosy Be.",
    image:
      "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80",
    icon: Fish,
    color: "from-red-500/20 to-orange-500/20",
    tag: "Fruits de mer",
  },
  {
    name: "Rhum Arrangé",
    description:
      "Rhum artisanal macéré avec vanille de Madagascar, fruits tropicaux (ananas, fruit de la passion) et épices locales.",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    icon: Wine,
    color: "from-rose-500/20 to-pink-500/20",
    tag: "À goûter",
  },
  {
    name: "Café Malgache",
    description:
      "Café arabica cultivé dans les hautes terres, torréfié artisanalement. Parfumé et corsé, servi avec du lait condensé.",
    image:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80",
    icon: Coffee,
    color: "from-amber-700/20 to-yellow-600/20",
    tag: "Produit local",
  },
];

export function Gastronomy() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!container.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".dish-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
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
      id="gastronomie"
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#050505] relative z-20 border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="text-xs uppercase tracking-widest text-amber-400 font-bold mb-4">
            Gastronomie
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
            Saveurs de{" "}
            <span className="italic font-serif text-amber-400">Madagascar</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
            Découvrez une cuisine riche et parfumée, héritée des traditions
            sakalava et des influences de l'océan Indien.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((dish, i) => {
            const Icon = dish.icon;
            return (
              <div
                key={i}
                className="dish-card group relative bg-[#151515] rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/30 transition-all duration-500"
              >
                <div
                  className={`h-48 bg-gradient-to-br ${dish.color} relative overflow-hidden`}
                >
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="w-full h-full object-cover mix-blend-overlay opacity-80 transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#151515] via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                    {dish.tag}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
