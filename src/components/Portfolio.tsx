import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Fintech Dashboard",
    tag: "SaaS / Web",
    color: "from-blue-500/20 to-purple-500/20",
    border: "border-blue-500/30",
  },
  {
    title: "Eco Mobile App",
    tag: "Mobile / UI",
    color: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/30",
  },
  {
    title: "Luxury E-commerce",
    tag: "Web / UI",
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-500/30",
  },
  {
    title: "Health Tracker",
    tag: "Mobile / SaaS",
    color: "from-rose-500/20 to-red-500/20",
    border: "border-rose-500/30",
  },
  {
    title: "Crypto Platform",
    tag: "Web / SaaS",
    color: "from-indigo-500/20 to-blue-500/20",
    border: "border-indigo-500/30",
  },
  {
    title: "AI CRM System",
    tag: "SaaS / UI",
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-500/30",
  },
];

export function Portfolio() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Scroll reveal stagger
      gsap.from(".portfolio-card", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
      });

      // Parallax on scroll
      gsap.to(".portfolio-card-inner", {
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
        y: (i) => (i % 2 === 0 ? -30 : 30),
        ease: "none",
      });
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      className="py-32 px-4 md:px-12 lg:px-24 bg-[#050505] relative z-20"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-20">
          <h2 className="text-sm uppercase tracking-widest text-violet-400 font-bold mb-4">
            Notre Sélection
          </h2>
          <h3 className="text-4xl md:text-5xl font-light mb-4 tracking-tight">
            Réalisations{" "}
            <span className="italic font-serif text-violet-400">Récentes</span>
          </h3>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
            Découvrez une sélection de nos meilleurs projets, conçus avec
            passion, précision et expertise technique.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16">
          {projects.map((project, i) => (
            <div
              key={i}
              className="portfolio-card group relative cursor-pointer"
            >
              {/* Blur glow effect */}
              <div
                className={`absolute -inset-1 rounded-2xl bg-linear-to-r ${project.color} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500`}
              ></div>

              <div className="portfolio-card-inner bg-[#151515] border border-white/5 rounded-2xl overflow-hidden relative z-10 transition-transform duration-500 group-hover:-translate-y-2 shadow-2xl">
                {/* Image preview (abstract replacement) */}
                <div
                  className={`h-64 bg-linear-to-br ${project.color} relative overflow-hidden flex items-center justify-center`}
                >
                  <div className="absolute inset-0 bg-[#050505]/40 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-white/5 mix-blend-overlay"></div>
                  <div
                    className={`w-3/4 h-3/4 border-t border-l border-white/10 rounded-tl-xl bg-[#0a0a0a]/80 backdrop-blur-md shadow-xl self-end translate-y-4 translate-x-4 transition-transform duration-700 group-hover:translate-y-0 group-hover:translate-x-0`}
                  ></div>
                </div>

                <div className="p-6 bg-[#1a1a1a]">
                  <div className="text-[10px] uppercase tracking-widest text-violet-400 font-bold mb-2">
                    {project.tag}
                  </div>
                  <h4 className="text-lg font-semibold flex items-center justify-between">
                    {project.title}
                    <ExternalLink className="w-4 h-4 text-white/50 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
