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
  Users,
  Headphones,
  BookOpen,
  FileText,
  PlayCircle,
  ArrowRight,
  Sparkles,
  Globe,
  Database,
  GitBranch,
  ClipboardList,
  Compass,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import { cn } from "@/src/lib/utils";
import { useQuoteStore, selectQuoteCount } from "@/src/store/quote-store";

// ============================================================
// TYPES
// ============================================================
interface SubItem {
  label: string;
  href: string;
  description: string;
  icon: any;
  badge?: string;
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
// DATA — inchangée
// ============================================================
const navLinks: NavLink[] = [
  {
    label: "Destinations",
    megamenu: true,
    featured: {
      label: "Découvrir Sainte-Marie",
      description: "L'île aux baleines et ses trésors cachés",
      href: "/",
      icon: Sparkles,
      gradient: "from-violet-600 to-indigo-600",
    },
    submenu: [
      {
        label: "Safari Baleines",
        href: "/excursions/safari-baleines",
        description: "Observation des baleines à bosse (juil-sept)",
        icon: Shield,
        badge: "Saison",
      },
      {
        label: "Baie d'Ampanihy",
        href: "/excursions/baie-ampanihy",
        description: "Eaux turquoises et villages de pêcheurs",
        icon: Cloud,
        badge: "Populaire",
      },
      {
        label: "Île aux Nattes",
        href: "/excursions/ile-aux-nattes",
        description: "Paradis préservé sans route ni voiture",
        icon: Sparkles,
        badge: "Incontournable",
      },
      {
        label: "Piscines Naturelles",
        href: "/excursions/piscines-naturelles",
        description: "Bassins coralliens et poissons tropicaux",
        icon: Globe,
      },
      {
        label: "Maison Blanche",
        href: "/excursions/maison-blanche",
        description: "Histoire des pirates et flibustiers",
        icon: Database,
      },
      {
        label: "Plongée Sous-Marine",
        href: "/excursions/plongee-sous-marine",
        description: "Récifs coralliens et épaves",
        icon: Code2,
        badge: "Nouveau",
      },
    ],
  },
  {
    label: "Hébergements",
    submenu: [
      {
        label: "Tous les hébergements",
        href: "/hebergements",
        description: "Voir tous les hôtels, lodges et villas",
        icon: BookOpen,
      },
      {
        label: "Lodges de luxe",
        href: "/hebergements?category=LUXE",
        description: "Pieds dans l'eau avec piscine",
        icon: FileText,
      },
      {
        label: "Bungalows",
        href: "/hebergements?category=BUNGALOW",
        description: "Authenticité et immersion locale",
        icon: PlayCircle,
      },
      {
        label: "Écolodges",
        href: "/hebergements?category=ECOLODGE",
        description: "Tourisme durable et nature",
        icon: Zap,
      },
    ],
  },
  {
    label: "Transports",
    submenu: [
      {
        label: "Tous les transports",
        href: "/transports",
        description: "Transferts et locations de véhicules",
        icon: Users,
      },
      {
        label: "Transferts privés",
        href: "/transports?type=TRANSFER",
        description: "Aéroport et port vers votre hôtel",
        icon: Headphones,
      },
      {
        label: "Location véhicules",
        href: "/transports?type=VEHICLE_RENTAL",
        description: "4x4, quads, scooters avec ou sans chauffeur",
        icon: GitBranch,
      },
    ],
  },
  { label: "Services +", href: "/services" },
  { label: "Contact", href: "/contact" },
];

// ============================================================
// BADGE VARIANT MAP — teintes claires
// ============================================================
const badgeStyles: Record<string, string> = {
  Populaire: "bg-violet-100 text-violet-700 border-violet-200",
  Incontournable: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Saison: "bg-amber-100 text-amber-700 border-amber-200",
  Nouveau: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

// ============================================================
// ANIMATION VARIANTS
// ============================================================
const EASE_SPRING = [0.16, 1, 0.3, 1] as [number, number, number, number];

const megaMenuVariants: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.98, filter: "blur(4px)" },
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
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

const mobileItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: EASE_SPRING },
  }),
};

// ============================================================
// LOGO — monogramme dégradé + libellé sur 3 lignes
// ============================================================
function BrandLogo() {
  return (
    <a href="/" className="flex items-center gap-2.5 shrink-0" data-no-drag>
      <div className="relative w-9 h-9 rounded-xl bg-linear-to-br from-violet-600 via-violet-500 to-indigo-500 shadow-lg shadow-violet-500/30 flex items-center justify-center">
        <span className="text-white font-black text-xs tracking-tighter">
          MB
        </span>
      </div>
      <div className="hidden sm:flex flex-col leading-[1.05]">
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-[#17123a]">
          Sainte Marie
        </span>
        <span className="text-[10px] font-black uppercase tracking-[0.14em] text-violet-600">
          Guide
        </span>
      </div>
    </a>
  );
}

// ============================================================
// SUB-COMPONENTS
// ============================================================
function MegaMenuItem({ item }: { item: SubItem }) {
  const Icon = item.icon;
  return (
    <motion.a
      href={item.href}
      variants={itemVariants}
      whileHover={{ x: 3 }}
      className="group flex items-start gap-3 p-3 rounded-xl hover:bg-violet-50 transition-colors duration-200 cursor-pointer"
    >
      <div className="shrink-0 w-9 h-9 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center group-hover:bg-violet-100 group-hover:border-violet-200 transition-all duration-300">
        <Icon className="w-4 h-4 text-violet-600 group-hover:text-violet-700 transition-colors" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-[#17123a]/85 group-hover:text-[#17123a] transition-colors">
            {item.label}
          </span>
          {item.badge && (
            <span
              className={cn(
                "text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
                badgeStyles[item.badge] ??
                  "bg-violet-100 text-violet-700 border-violet-200",
              )}
            >
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-[#17123a]/45 group-hover:text-[#17123a]/60 transition-colors leading-relaxed line-clamp-2">
          {item.description}
        </p>
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-violet-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all duration-300 mt-1 shrink-0" />
    </motion.a>
  );
}

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

function StandardDropdown({ items }: { items: SubItem[] }) {
  return (
    <motion.div
      variants={megaMenuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white/98 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-2xl shadow-violet-950/10 overflow-hidden z-[9998]"
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-300 to-transparent" />
      <div className="p-2">
        {items.map((item) => (
          <MegaMenuItem key={item.href} item={item} />
        ))}
      </div>
    </motion.div>
  );
}

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
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white/98 backdrop-blur-2xl border border-slate-200 rounded-2xl shadow-2xl shadow-violet-950/10 overflow-hidden z-[9998]"
      style={{ width: "720px", zIndex: 9999 }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-violet-300 to-transparent" />

      <div className="flex">
        {featured && (
          <div className="w-56 shrink-0 p-3 border-r border-slate-100">
            <FeaturedCard featured={featured} />
          </div>
        )}

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

      <div className="border-t border-slate-100 px-4 py-2.5 flex items-center justify-between bg-slate-50/60">
        <span className="text-xs text-[#17123a]/40">
          Toutes les destinations de Sainte Marie
        </span>
        <a
          href="/excursions"
          className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1 group"
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
  const count = useQuoteStore(selectQuoteCount);
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
    <TooltipProvider delay={300}>
      <div className="fixed top-0 inset-x-0 z-[999] flex justify-center px-4 py-3">
        <motion.nav
          ref={navRef}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE_SPRING }}
          className={cn(
            "w-full max-w-6xl rounded-2xl transition-all duration-500",
            scrolled
              ? "bg-white/95 backdrop-blur-2xl border border-slate-200 shadow-xl shadow-violet-950/10"
              : "bg-white/80 backdrop-blur-xl border border-white/60 shadow-lg shadow-violet-950/5",
          )}
        >
          <div className="flex items-center justify-between gap-6 px-4 lg:px-5 h-16">
            {/* ── LOGO ── */}
            <BrandLogo />

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
                            ? "text-violet-700 bg-violet-50"
                            : "text-[#17123a]/60 hover:text-[#17123a] hover:bg-slate-50",
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
                          className="relative flex items-center px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-widest text-[#17123a]/60 hover:text-[#17123a] hover:bg-slate-50 transition-all duration-200 group"
                        >
                          {link.label}
                          <span className="absolute bottom-1.5 left-3.5 right-3.5 h-px bg-linear-to-r from-violet-500 to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                        </motion.a>
                      </TooltipTrigger>
                      <TooltipContent
                        side="bottom"
                        sideOffset={10}
                        className="bg-white border border-slate-200 text-[#17123a] text-xs rounded-lg shadow-lg shadow-violet-950/10 z-[99999]"
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
              {/* <Button
              variant="ghost"
              size="sm"
              className="text-[#17123a]/60 hover:text-[#17123a] hover:bg-slate-50 text-xs font-semibold uppercase tracking-widest rounded-xl h-9"
            >
              Connexion
            </Button> */}

              <motion.a
                href="/devis"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex items-center gap-2 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl h-9 px-4 border-0 shadow-lg shadow-violet-500/30 group overflow-hidden"
              >
                <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <ClipboardList className="w-3 h-3 relative z-10" />
                <span className="relative z-10">Mon devis</span>
                {count > 0 && (
                  <span className="relative z-10 flex size-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-black">
                    {count}
                  </span>
                )}
              </motion.a>
            </div>

            {/* ── MOBILE TOGGLE ── */}
            <div className="lg:hidden flex items-center justify-center h-full">
              <motion.button
                whileTap={{ scale: 0.5 }}
                onClick={() => setOpenMobile(!openMobile)}
                className="lg:hidden relative p-2.5 ml-auto rounded-xl hover:bg-slate-50 transition-colors duration-200"
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
                      <X className="w-5 h-5 text-[#17123a]" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5 text-[#17123a]" />
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
                <Separator className="bg-slate-100" />
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
                                mobileExpanded === link.label
                                  ? null
                                  : link.label,
                              )
                            }
                            className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest text-[#17123a]/60 hover:text-[#17123a] hover:bg-slate-50 transition-all duration-200 group"
                          >
                            <span className="group-hover:text-[#17123a] transition-colors">
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
                                className="overflow-hidden ml-3 mt-1 pl-3 border-l border-violet-200"
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
                                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-violet-50 group transition-colors duration-200"
                                    >
                                      <div className="w-7 h-7 rounded-lg bg-violet-50 border border-violet-100 flex items-center justify-center group-hover:bg-violet-100 transition-colors shrink-0">
                                        <Icon className="w-3.5 h-3.5 text-violet-600" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                          <span className="text-sm text-[#17123a]/75 group-hover:text-[#17123a] transition-colors font-medium">
                                            {item.label}
                                          </span>
                                          {item.badge && (
                                            <span
                                              className={cn(
                                                "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
                                                badgeStyles[item.badge] ??
                                                  "bg-violet-100 text-violet-700 border-violet-200",
                                              )}
                                            >
                                              {item.badge}
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-[11px] text-[#17123a]/40 mt-0.5 line-clamp-1">
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
                          className="block px-4 py-3 rounded-xl text-sm font-semibold uppercase tracking-widest text-[#17123a]/60 hover:text-[#17123a] hover:bg-slate-50 transition-all duration-200"
                        >
                          {link.label}
                        </motion.a>
                      )}
                    </motion.div>
                  ))}

                  <motion.div
                    custom={navLinks.length}
                    variants={mobileItemVariants}
                    initial="hidden"
                    animate="visible"
                    className="pt-3 space-y-2"
                  >
                    <Separator className="bg-slate-100" />
                    <Button
                      variant="ghost"
                      className="w-full text-[#17123a]/60 hover:text-[#17123a] hover:bg-slate-50 rounded-xl h-11 text-sm font-semibold"
                    >
                      Connexion
                    </Button>
                    <Button className="w-full relative overflow-hidden bg-linear-to-r from-violet-600 to-indigo-600 text-white rounded-xl h-11 text-sm font-bold shadow-lg shadow-violet-500/30 group border-0">
                      <a
                        href="/devis"
                        className="flex items-center justify-center gap-2"
                      >
                        <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <ClipboardList className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">
                          Mon devis {count > 0 && `(${count})`}
                        </span>
                      </a>
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </TooltipProvider>
  );
}
