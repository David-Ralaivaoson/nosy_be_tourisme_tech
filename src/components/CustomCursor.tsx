import { useEffect, useRef } from "react";
import gsap from "gsap";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if it's touch device to disable custom cursor on mobile
    if (window.matchMedia("(pointer: coarse)").matches) return;

    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
    gsap.set(glowRef.current, { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursorRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out",
      });
      gsap.to(glowRef.current, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.8,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div className="hidden sm:block">
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full mix-blend-screen z-100 shadow-[0_0_10px_rgba(255,255,255,0.8)]"
      ></div>
      <div
        ref={glowRef}
        className="fixed top-0 left-0 w-64 h-64 bg-violet-600/20 blur-2xl rounded-full z-90"
      ></div>
    </div>
  );
}
