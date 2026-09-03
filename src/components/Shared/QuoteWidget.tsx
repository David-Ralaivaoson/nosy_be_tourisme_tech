"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { useQuoteStore, selectQuoteCount } from "@/src/store/quote-store";

export default function QuoteWidget() {
  const pathname = usePathname();
  const count = useQuoteStore(selectQuoteCount);

  if (pathname === "/devis" || count === 0) return null;

  return (
    <Link
      href="/devis"
      className="fixed bottom-6 left-6 z-[9990] flex items-center gap-3 rounded-full border border-violet-500/30 bg-[#0a0a0a]/90 px-5 py-3 shadow-2xl shadow-violet-500/20 backdrop-blur-xl transition hover:border-violet-400/60"
    >
      <span className="relative">
        <ClipboardList className="size-5 text-violet-400" />
        <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-amber-400 text-[9px] font-black text-black">
          {count}
        </span>
      </span>
      <span className="text-xs font-bold uppercase tracking-widest text-white/80">
        Voir mon devis
      </span>
    </Link>
  );
}
