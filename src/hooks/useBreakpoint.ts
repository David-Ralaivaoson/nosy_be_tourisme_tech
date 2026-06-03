import { useEffect, useState } from "react";

// ─── Breakpoints ──────────────────────────────────────────────────────────────
export type Breakpoint = "mobile" | "tablet" | "desktop";

export function getBreakpoint(w: number): Breakpoint {
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>(() =>
    typeof window !== "undefined"
      ? getBreakpoint(window.innerWidth)
      : "desktop",
  );
  useEffect(() => {
    const update = () => setBp(getBreakpoint(window.innerWidth));
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return bp;
}
