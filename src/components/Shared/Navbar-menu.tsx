"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  Zap,
  Shield,
  Cloud,
  Code2,
  BarChart3,
  Users,
  Headphones,
  BookOpen,
  FileText,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Globe,
  Lock,
  Cpu,
  Database,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ============================================================
// TYPES
// ============================================================
interface SubItem {
  label: string;
  href: string;
  description: string;
  icon: any;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

interface FeaturedItem {
  label: string;
  description: string;
  href: string;
  icon: any;
  gradient: string;
}

interface NavLink {
  label: string;
  href?: string;
  submenu?: SubItem[];
  featured?: FeaturedItem;
  megamenu?: boolean;
}

// ============================================================
// DATA
// ============================================================
const navLinks: NavLink[] = [
  {
    label: "Solutions",
    megamenu: true,
    featured: {
      label: "Découvrir notre plateforme",
      description:
        "Une suite complète d'outils pour transformer votre entreprise",
      href: "/platform",
      icon: Sparkles,
      gradient: "from-violet-600 to-indigo-600",
    },
    submenu: [
      {
        label: "Infrastructure Cloud",
        href: "/solutions/cloud",
        description:
          "Déployez et gérez vos ressources cloud en toute simplicité",
        icon: Cloud,
        badge: "Populaire",
      },
      {
        label: "Cybersécurité",
        href: "/solutions/security",
        description: "Protection avancée contre les menaces modernes",
        icon: Shield,
        badge: "Nouveau",
      },
      {
        label: "Intelligence Artificielle",
        href: "/solutions/ai",
        description: "Intégrez l'IA dans vos processus métier",
        icon: Cpu,
        badge: "Beta",
      },
      {
        label: "Data & Analytics",
        href: "/solutions/data",
        description: "Transformez vos données en insights actionnables",
        icon: BarChart3,
      },
      {
        label: "DevOps & CI/CD",
        href: "/solutions/devops",
        description: "Accélérez vos cycles de livraison logicielle",
        icon: GitBranch,
      },
      {
        label: "Base de données",
        href: "/solutions/database",
        description: "Solutions de stockage haute performance et fiables",
        icon: Database,
      },
    ],
  },
  {
    label: "Produits",
    submenu: [
      {
        label: "API Platform",
        href: "/products/api",
        description: "Connectez vos systèmes avec nos APIs robustes",
        icon: Code2,
      },
      {
        label: "Global Network",
        href: "/products/network",
        description: "Infrastructure réseau mondiale ultra-rapide",
        icon: Globe,
      },
      {
        label: "Zero Trust Security",
        href: "/products/security",
        description: "Architecture sécurité zéro confiance",
        icon: Lock,
      },
      {
        label: "Performance Suite",
        href: "/products/performance",
        description: "Optimisez les performances de vos applications",
        icon: Zap,
        badge: "Nouveau",
      },
    ],
  },
  {
    label: "Ressources",
    submenu: [
      {
        label: "Documentation",
        href: "/docs",
        description: "Guides complets et références API",
        icon: FileText,
      },
      {
        label: "Blog & Insights",
        href: "/blog",
        description: "Articles tech, tendances et meilleures pratiques",
        icon: BookOpen,
      },
      {
        label: "Tutoriels vidéo",
        href: "/tutorials",
        description: "Apprenez par l'exemple avec nos vidéos",
        icon: PlayCircle,
      },
      {
        label: "Support technique",
        href: "/support",
        description: "Notre équipe disponible 24/7 pour vous aider",
        icon: Headphones,
      },
    ],
  },
  {
    label: "Entreprise",
    submenu: [
      {
        label: "À propos",
        href: "/about",
        description: "Notre mission, valeurs et histoire",
        icon: Users,
      },
      {
        label: "Carrières",
        href: "/careers",
        description: "Rejoignez une équipe passionnée par la tech",
        icon: Sparkles,
        badge: "On recrute",
      },
    ],
  },
  { label: "Tarifs", href: "/pricing" },
];

// ============================================================
// BADGE VARIANT MAP
// ============================================================
const badgeStyles: Record<string, string> = {
  Populaire: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  Nouveau: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Beta: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "On recrute": "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

// ============================================================
// ANIMATION VARIANTS
// ============================================================

// ✅ Fix: ease cubicBezier casté en tuple strict [number,number,number,number]
const EASE_SPRING = [0.16, 1, 0.3, 1] as [number, number, number, number];

const megaMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.98,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.25,
      ease: EASE_SPRING,
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.97,
    filter: "blur(2px)",
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
};

const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.35, ease: EASE_SPRING },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

// ✅ Fix principal : ne PAS typer avec Variants (incompatible avec custom functions)
//    On garde le type inféré, et on caste ease correctement
const mobileItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.06,
      duration: 0.3,
      // ✅ Tuple strict au lieu de number[] générique
      ease: EASE_SPRING,
    },
  }),
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

/** Carte d'item pour le mega menu */
function MegaMenuItem({ item }: { item: SubItem }) {
  const Icon = item.icon;
  return (
    <motion.a
      href={item.href}
      variants={itemVariants}
      whileHover={{ x: 3 }}
      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors duration-200 cursor-pointer"
    >
      <div className="shrink-0 w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/20 group-hover:border-violet-500/40 transition-all duration-300">
        <Icon className="w-4 h-4 text-violet-400 group-hover:text-violet-300 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
            {item.label}
          </span>
          {item.badge && (
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
                badgeStyles[item.badge as keyof typeof badgeStyles] ??
                  "bg-violet-500/20 text-violet-300 border-violet-500/30",
              )}
            >
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-violet-400 group-hover:translate-x-1 transition-all duration-300 mt-1 shrink-0" />
    </motion.a>
  );
}

/** Carte featured dans le mega menu */
function FeaturedCard({ featured }: { featured: FeaturedItem }) {
  const Icon = featured.icon;
  return (
    <motion.a
      href={featured.href}
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "group relative flex flex-col justify-between h-full p-5 rounded-xl overflow-hidden cursor-pointer",
        "bg-linear-to-br border border-white/10",
        featured.gradient,
      )}
    >
      {/* Animated background orb */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white blur-3xl group-hover:scale-150 transition-transform duration-700" />
      </div>

      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4 group-hover:bg-white/30 transition-colors duration-300">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h4 className="text-sm font-bold text-white mb-2">{featured.label}</h4>
        <p className="text-xs text-white/70 leading-relaxed">
          {featured.description}
        </p>
      </div>

      <div className="relative z-10 mt-4 flex items-center gap-1.5 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
        <span>Explorer</span>
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform duration-300" />
      </div>
    </motion.a>
  );
}

/** Dropdown standard (non-mega) */
function StandardDropdown({ items }: { items: SubItem[] }) {
  return (
    <motion.div
      variants={megaMenuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
      style={{ zIndex: 9999 }}
    >
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="p-2">
        {items.map((item) => (
          <MegaMenuItem key={item.href} item={item} />
        ))}
      </div>
    </motion.div>
  );
}

/** Mega menu complet */
function MegaMenuDropdown({
  submenu,
  featured,
}: {
  submenu: SubItem[];
  featured?: FeaturedItem;
}) {
  const half = Math.ceil(submenu.length / 2);
  const col1 = submenu.slice(0, half);
  const col2 = submenu.slice(half);

  return (
    <motion.div
      variants={megaMenuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
      style={{ width: "720px", zIndex: 9999 }}
    >
      {/* Top glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="flex">
        {/* Featured card */}
        {featured && (
          <div className="w-56 shrink-0 p-3 border-r border-white/5">
            <FeaturedCard featured={featured} />
          </div>
        )}

        {/* Grid d'items */}
        <div className="flex-1 p-3 grid grid-cols-2 gap-0">
          <div>
            {col1.map((item) => (
              <MegaMenuItem key={item.href} item={item} />
            ))}
          </div>
          <div>
            {col2.map((item) => (
              <MegaMenuItem key={item.href} item={item} />
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 px-4 py-2.5 flex items-center justify-between bg-white/2">
        <span className="text-xs text-white/30">
          Toutes nos solutions technologiques
        </span>
        <a
          href="/solutions"
          className="text-xs font-medium text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 group"
        >
          Voir tout
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </motion.div>
  );
}

// ============================================================
// MAIN NAVBAR
// ============================================================
export function NavbarMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [openMobile, setOpenMobile] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
        setOpenMobile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setOpenMobile(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const handleMouseEnter = useCallback((label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveMenu(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setActiveMenu(null), 150);
  }, []);

  return (
    <div className="fixed top-0 right-0 z-9999 flex justify-center px-4 py-2">
      <motion.nav
        ref={navRef}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE_SPRING }}
        className={cn(
          "w-full max-w-6xl rounded-2xl transition-all duration-500",
          scrolled
            ? "bg-slate-950/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/50"
            : "bg-slate-950/70 backdrop-blur-xl border border-white/5 shadow-lg shadow-black/20",
        )}
      >
        <div className="flex items-center justify-between gap-12 lg:px-5 lg:h-16">
          {/* ── DESKTOP NAV ── */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() =>
                  link.submenu && handleMouseEnter(link.label)
                }
                onMouseLeave={() => link.submenu && handleMouseLeave()}
              >
                {link.submenu ? (
                  <>
                    <button
                      onClick={() =>
                        setActiveMenu(
                          activeMenu === link.label ? null : link.label,
                        )
                      }
                      className={cn(
                        "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all duration-200",
                        activeMenu === link.label
                          ? "text-white bg-white/10"
                          : "text-white/60 hover:text-white hover:bg-white/5",
                      )}
                      aria-expanded={activeMenu === link.label}
                    >
                      {link.label}
                      <motion.div
                        animate={{
                          rotate: activeMenu === link.label ? 180 : 0,
                        }}
                        transition={{ duration: 0.25 }}
                      >
                        <ChevronDown className="w-3 h-3" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {activeMenu === link.label && (
                        <>
                          {link.megamenu ? (
                            <MegaMenuDropdown
                              submenu={link.submenu}
                              featured={link.featured}
                            />
                          ) : (
                            <StandardDropdown items={link.submenu} />
                          )}
                        </>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Tooltip>
                    <TooltipTrigger>
                      <motion.a
                        href={link.href}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="relative flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                      >
                        {link.label}
                        <span className="absolute bottom-1.5 left-3.5 right-3.5 h-px bg-linear-to-r from-violet-400 to-indigo-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      </motion.a>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="bg-slate-900 border z-[99999] border-violet-500/20 text-white text-xs rounded-lg"
                    >
                      Accéder à {link.label}
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            ))}
          </div>

          {/* ── ACTIONS DESKTOP ── */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/5 text-xs font-semibold uppercase tracking-widest rounded-xl h-9"
            >
              Connexion
            </Button>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                size="sm"
                className="relative overflow-hidden bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl h-9 px-5 border-0 shadow-lg shadow-violet-500/25 group"
              >
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Sparkles className="w-3 h-3 mr-1.5 relative z-10" />
                <span className="relative z-10">Essai gratuit</span>
              </Button>
            </motion.div>
          </div>

          {/* ── MOBILE TOGGLE ── */}
          <div className="lg:hidden flex items-center justify-center h-full">
            <motion.button
              whileTap={{ scale: 0.5 }}
              onClick={() => setOpenMobile(!openMobile)}
              className="lg:hidden relative p-3 ml-auto rounded-xl hover:bg-white/5 transition-colors duration-200"
              aria-label="Toggle navigation"
            >
              <AnimatePresence mode="wait">
                {openMobile ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5 text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <AnimatePresence>
          {openMobile && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="lg:hidden overflow-hidden"
            >
              <Separator className="bg-white/5" />
              <div className="p-3 space-y-1 max-h-[75vh] overflow-y-auto">
                {navLinks.map((link, idx) => (
                  <motion.div
                    key={link.label}
                    custom={idx}
                    variants={mobileItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {link.submenu ? (
                      <div>
                        <button
                          onClick={() =>
                            setMobileExpanded(
                              mobileExpanded === link.label ? null : link.label,
                            )
                          }
                          className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                        >
                          <span className="group-hover:text-white transition-colors">
                            {link.label}
                          </span>
                          <motion.div
                            animate={{
                              rotate: mobileExpanded === link.label ? 180 : 0,
                            }}
                            transition={{ duration: 0.25 }}
                          >
                            <ChevronDown className="w-4 h-4" />
                          </motion.div>
                        </button>

                        <AnimatePresence>
                          {mobileExpanded === link.label && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden ml-3 mt-1 pl-3 border-l border-violet-500/20"
                            >
                              {link.submenu.map((item, subIdx) => {
                                const Icon = item.icon;
                                return (
                                  <motion.a
                                    key={item.href}
                                    href={item.href}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: subIdx * 0.05 }}
                                    onClick={() => setOpenMobile(false)}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 group transition-colors duration-200"
                                  >
                                    <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors shrink-0">
                                      <Icon className="w-3.5 h-3.5 text-violet-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm text-white/70 group-hover:text-white transition-colors font-medium">
                                          {item.label}
                                        </span>
                                        {item.badge && (
                                          <span
                                            className={cn(
                                              "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
                                              badgeStyles[item.badge] ??
                                                "bg-violet-500/20 text-violet-300 border-violet-500/30",
                                            )}
                                          >
                                            {item.badge}
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-[11px] text-white/30 mt-0.5 line-clamp-1">
                                        {item.description}
                                      </p>
                                    </div>
                                  </motion.a>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <motion.a
                        href={link.href}
                        onClick={() => setOpenMobile(false)}
                        whileHover={{ x: 4 }}
                        className="block px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all duration-200"
                      >
                        {link.label}
                      </motion.a>
                    )}
                  </motion.div>
                ))}

                {/* Mobile CTA */}
                <motion.div
                  custom={navLinks.length}
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="pt-3 space-y-2"
                >
                  <Separator className="bg-white/5" />
                  <Button
                    variant="ghost"
                    className="w-full text-white/60 hover:text-white hover:bg-white/5 rounded-xl h-11 text-sm font-semibold"
                  >
                    Connexion
                  </Button>
                  <Button className="w-full relative overflow-hidden bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-xl h-11 text-sm font-bold shadow-lg shadow-violet-500/25 group border-0">
                    <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Sparkles className="w-4 h-4 mr-2 relative z-10" />
                    <span className="relative z-10">
                      Commencer gratuitement
                    </span>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
