"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ClipboardList, Menu, Waves } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Sheet, SheetContent } from "@/src/components/ui/sheet";
import { useQuoteStore, selectQuoteCount } from "@/src/store/quote-store";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/hebergements", label: "Hébergements" },
  { href: "/excursions", label: "Excursions" },
  { href: "/transports", label: "Transports" },
  { href: "/immobilier", label: "Immobilier" },
  { href: "/services", label: "Services +" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const count = useQuoteStore(selectQuoteCount);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-teal-400">
            <Waves className="size-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold uppercase tracking-[0.18em]">
              Sainte-Marie
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-400">
              Travel · Madagascar
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-colors",
                pathname === l.href
                  ? "text-cyan-400"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/devis"
            className="relative hidden items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white shadow-lg shadow-cyan-500/25 transition hover:from-cyan-500 hover:to-teal-500 lg:flex"
          >
            <ClipboardList className="size-4" />
            Mon devis
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-black">
                {count}
              </span>
            )}
          </Link>

          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 hover:bg-white/5 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="size-5" />
          </button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="border-white/10 bg-[#0a0a0a]">
          <nav className="mt-8 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-semibold uppercase tracking-widest",
                  pathname === l.href
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-white/70 hover:bg-white/5",
                )}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/devis"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 px-4 py-3 text-sm font-bold uppercase tracking-widest"
            >
              <ClipboardList className="size-4" />
              Mon devis {count > 0 && `(${count})`}
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
