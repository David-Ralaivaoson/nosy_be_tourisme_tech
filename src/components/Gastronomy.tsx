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
      "Ragoût traditionnel de brèdes mijotées au zébu, tomates et gingembre. Le plat national malgache.",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80",
    icon: Utensils,
    color: "from-amber-500/20 to-orange-500/20",
    tag: "Plat National",
  },
  {
    name: "Ravitoto",
    description:
      "Feuilles de manioc pilées mijotées au porc, ail et lait de coco. Spécialité de la côte est.",
    image:
      "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&q=80",
    icon: Leaf,
    color: "from-green-500/20 to-emerald-500/20",
    tag: "Spécialité Locale",
  },
  {
    name: "Lasary",
    description:
      "Salade fraîche de légumes au citron vert et piment. L'accompagnement typique des gargotes locales.",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80",
    icon: Leaf,
    color: "from-blue-500/20 to-cyan-500/20",
    tag: "Frais",
  },
  {
    name: "Langoustes Grillées",
    description:
      "Langoustes pêchées dans le lagon, grillées au feu de bois, ail-citron. LE incontournable de l'Île aux Nattes.",
    image:
      "https://images.unsplash.com/photo-1559737558-2f5a35f4523b?w=800&q=80",
    icon: Fish,
    color: "from-red-500/20 to-orange-500/20",
    tag: "Fruits de mer",
  },
  {
    name: "Rhum Arrangé",
    description:
      "Rhum artisanal macéré à la vanille de Madagascar, ananas, passion et épices locales.",
    image:
      "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
    icon: Wine,
    color: "from-rose-500/20 to-pink-500/20",
    tag: "À goûter",
  },
  {
    name: "Café Malgache",
    description:
      "Arabica des hautes terres torréfié artisanalement, servi corsé avec lait condensé.",
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
      className="py-32 px-4 md:px-12 lg:px-24 bg-white relative z-20 border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <div className="text-xs uppercase tracking-widest text-amber-600 font-bold mb-4">
            Gastronomie
          </div>
          <h2 className="text-4xl md:text-5xl font-light mb-4 tracking-tight text-[#17123a]">
            Saveurs de{" "}
            <span className="italic font-serif text-amber-600">Madagascar</span>
          </h2>
          <p className="text-[#17123a]/50 text-lg md:text-xl max-w-2xl font-light">
            Une cuisine riche et parfumée, entre traditions malgaches et trésors
            du lagon de Sainte-Marie.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dishes.map((d, i) => (
            <div
              key={i}
              className="dish-card group relative bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-amber-300 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div
                className={`h-48 bg-gradient-to-br ${d.color} relative overflow-hidden`}
              >
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover mix-blend-overlay opacity-80 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center">
                  <d.icon className="w-5 h-5 text-amber-600" />
                </div>
                <div className="absolute top-4 left-4 px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                  {d.tag}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-[#17123a]">
                  {d.name}
                </h3>
                <p className="text-sm text-[#17123a]/60 leading-relaxed">
                  {d.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
