"use client";
import { useEffect, useId, useRef } from "react";

/**
 * Soulignement "à main levée" qui épouse le mot :
 * - trait principal gauche → droite, légère arche descendante
 * - petit retour de plume sous la fin du trait (fini manuscrit)
 * - écho plus fin et décalé pour l'effet crayon
 * Hauteur réduite (0.24em) + collé à la baseline → plus de "ballon".
 */
const HandDrawnUnderline = ({ id }: { id: string }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const VW = 640;
  const VH = 48;

  /* Trait principal : aller + retour de plume */
  const mainPath = `
    M 8 24
    C 110 13, 250 8, 380 10
    C 480 12, 570 17, 632 24
    C 610 30, 560 33, 500 34
  `;

  /* Écho fin, légèrement plus bas */
  const texPath = `
    M 24 32
    C 140 24, 300 20, 440 22
    C 520 24, 580 28, 616 32
  `;

  useEffect(() => {
    const main = pathRef.current;
    const tex = path2Ref.current;
    if (!main || !tex) return;
    const len1 = main.getTotalLength();
    const len2 = tex.getTotalLength();
    main.style.transition = "none";
    tex.style.transition = "none";
    main.style.strokeDasharray = `${len1}`;
    main.style.strokeDashoffset = `${len1}`;
    tex.style.strokeDasharray = `${len2}`;
    tex.style.strokeDashoffset = `${len2}`;
    void main.getBoundingClientRect();
    const t = setTimeout(() => {
      main.style.transition =
        "stroke-dashoffset 1.1s cubic-bezier(0.65,0,0.35,1)";
      tex.style.transition =
        "stroke-dashoffset 1.2s cubic-bezier(0.65,0,0.35,1)";
      main.style.strokeDashoffset = "0";
      tex.style.strokeDashoffset = "0";
    }, 650);
    return () => clearTimeout(t);
  }, []);

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        left: "-2%",
        bottom: "-0.16em",
        width: "104%",
        height: "0.24em",
        overflow: "visible",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <defs>
        <linearGradient id={`${id}-grad`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4f46e5" />
          <stop offset="55%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <filter
          id={`${id}-crayon`}
          x="-25%"
          y="-60%"
          width="150%"
          height="220%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="3"
            seed="6"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="2.2"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
      <path
        ref={path2Ref}
        d={texPath}
        fill="none"
        stroke={`url(#${id}-grad)`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-crayon)`}
        style={{ opacity: 0.35 }}
      />
      <path
        ref={pathRef}
        d={mainPath}
        fill="none"
        stroke={`url(#${id}-grad)`}
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-crayon)`}
        style={{ opacity: 0.9 }}
      />
    </svg>
  );
};

export const SainteMarieUnderline = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const id = useId().replace(/[:]/g, "");
  return (
    <span
      className={className}
      style={{
        position: "relative",
        display: "inline-block",
        padding: "0 0.06em",
      }}
    >
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
      <HandDrawnUnderline id={id} />
    </span>
  );
};
