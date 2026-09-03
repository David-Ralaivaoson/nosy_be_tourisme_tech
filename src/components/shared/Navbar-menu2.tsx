"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/src/lib/utils"; // Assure-toi d'avoir cet utilitaire shadcn
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/src/components/ui/navigation-menu";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Badge } from "@/src/components/ui/badge";
import {
  Menu,
  X,
  ChevronRight,
  Zap,
  Shield,
  Globe,
  Code,
  Server,
  Cpu,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// --- CONFIGURATION DU MENU (Données) ---
const navItems = [
  {
    title: "Produits",
    href: "/products",
    icon: <Cpu className="w-4 h-4" />,
    description: "Nos solutions technologiques de pointe",
    items: [
      {
        title: "Cloud Infrastructure",
        href: "/products/cloud",
        description: "Déploiement scalable et sécurisé.",
        icon: <Server className="w-5 h-5 text-blue-400" />,
      },
      {
        title: "AI Analytics",
        href: "/products/ai",
        description: "Insights propulsés par l'intelligence artificielle.",
        icon: <Sparkles className="w-5 h-5 text-purple-400" />,
      },
      {
        title: "Cyber Security",
        href: "/products/security",
        description: "Protection enterprise-grade 24/7.",
        icon: <Shield className="w-5 h-5 text-emerald-400" />,
      },
    ],
  },
  {
    title: "Solutions",
    href: "/solutions",
    icon: <Globe className="w-4 h-4" />,
    description: "Cas d'usage par industrie",
    items: [
      {
        title: "Fintech",
        href: "/solutions/fintech",
        description: "Pour les banques et assurances.",
        icon: <Zap className="w-5 h-5 text-yellow-400" />,
      },
      {
        title: "Healthcare",
        href: "/solutions/health",
        description: "Conformité HIPAA et données patients.",
        icon: <Shield className="w-5 h-5 text-red-400" />,
      },
    ],
  },
  {
    title: "Développeurs",
    href: "/docs",
    icon: <Code className="w-4 h-4" />,
    description: "Documentation et API",
    items: [
      {
        title: "Documentation",
        href: "/docs",
        description: "Guides complets et références API.",
        icon: <Code className="w-5 h-5 text-orange-400" />,
      },
      {
        title: "Status",
        href: "/status",
        description: "Uptime et incidents en temps réel.",
        icon: <Zap className="w-5 h-5 text-green-400" />,
      },
    ],
  },
];

// --- COMPOSANT : ListItem (Pour le Mega Menu) ---
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a"> & { icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-outline transition-all duration-200 hover:bg-slate-800/50 hover:translate-x-1 group",
            className,
          )}
          {...props}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 group-hover:border-slate-700 transition-colors">
              {icon}
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium leading-none text-slate-100 group-hover:text-white">
                {title}
              </div>
              <p className="line-clamp-2 text-xs leading-snug text-slate-400 group-hover:text-slate-300">
                {children}
              </p>
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

// --- COMPOSANT PRINCIPAL ---
export function UltimateNavbar() {
  const [scrolled, setScrolled] = React.useState(false);

  // Gestion de l'effet de scroll pour la navbar
  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
        scrolled
          ? "bg-slate-950/80 backdrop-blur-md border-slate-800/50 py-3 shadow-lg shadow-black/20"
          : "bg-transparent border-transparent py-5",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300">
            T
          </div>
          <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            TechNova
          </span>
        </Link>

        {/* DESKTOP NAVIGATION (Mega Menu) */}
        <nav className="hidden md:flex items-center gap-1">
          <NavigationMenu>
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white data-[state=open]:text-white data-[state=open]:bg-slate-800/50 transition-all duration-200 font-medium text-sm">
                    {item.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="w-[450px] bg-slate-950/95 border border-slate-800 backdrop-blur-xl shadow-2xl shadow-black/50 rounded-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-slate-800/50 mb-2">
                      <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                        {item.icon} {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <ul className="grid w-full gap-1 p-2 md:w-[400px] lg:w-[450px]">
                      {item.items.map((subItem) => (
                        <ListItem
                          key={subItem.title}
                          title={subItem.title}
                          href={subItem.href}
                          icon={subItem.icon}
                        >
                          {subItem.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}

              {/* Lien simple sans dropdown */}
              <NavigationMenuItem>
                <Link href="/pricing" legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all",
                    )}
                  >
                    Tarifs
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </nav>

        {/* ACTIONS (CTA & Mobile) */}
        <div className="flex items-center gap-4">
          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-transparent"
            >
              Connexion
            </Button>
            <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20 transition-all duration-300 hover:scale-105 active:scale-95">
              Commencer <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Mobile Toggle */}
          <MobileMenu items={navItems} />
        </div>
      </div>
    </header>
  );
}

// --- COMPOSANT MOBILE (Sheet) ---
function MobileMenu({ items }: { items: typeof navItems }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[85vw] sm:w-[400px] bg-slate-950 border-l border-slate-800 p-0 overflow-y-auto"
      >
        <SheetHeader className="p-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm sticky top-0 z-10">
          <SheetTitle className="flex items-center gap-2 text-white">
            <div className="w-6 h-6 rounded bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-xs font-bold">
              T
            </div>
            Menu
          </SheetTitle>
          <SheetTrigger className="absolute right-4 top-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </Button>
          </SheetTrigger>
        </SheetHeader>

        <div className="p-6 space-y-8">
          {/* Navigation Links */}
          <div className="space-y-4">
            {items.map((item, idx) => (
              <div
                key={item.title}
                className="space-y-3 animate-in slide-in-from-right-4 duration-500"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-2 text-slate-100 font-semibold">
                  {item.icon} {item.title}
                </div>
                <div className="pl-6 space-y-2 border-l border-slate-800 ml-2">
                  {item.items.map((sub) => (
                    <Link
                      key={sub.title}
                      href={sub.href}
                      onClick={() => setOpen(false)}
                      className="block text-sm text-slate-400 hover:text-violet-400 transition-colors py-1"
                    >
                      {sub.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="block text-sm text-slate-400 hover:text-violet-400 transition-colors py-1 pl-6 border-l border-slate-800 ml-2"
            >
              Tarifs
            </Link>
          </div>

          <div className="pt-6 border-t border-slate-800 space-y-3 animate-in slide-in-from-bottom-4 duration-700">
            <Button
              variant="outline"
              className="w-full border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-white"
            >
              Connexion
            </Button>
            <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white">
              Commencer maintenant
            </Button>
          </div>

          <div className="pt-4 text-center">
            <Badge
              variant="secondary"
              className="bg-slate-900 text-slate-500 border-slate-800"
            >
              v2.4.0 Stable
            </Badge>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
