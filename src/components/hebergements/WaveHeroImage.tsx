"use client";

import { motion } from "framer-motion";
import { useId } from "react";
import { Sun } from "lucide-react";

type Props = {
  src: string;
  alt: string;
  delay?: number;
};

/**
 * Effet "déchiré de la page" :
 * bords irréguliers procéduraux (feTurbulence + feDisplacementMap),
 * liseré papier blanc + sous-couche violette révélée en premier.
 */
export default function WaveHeroImage({ src, alt, delay = 0.2 }: Props) {
  const rawId = useId().replace(/[:]/g, "");
  const roughId = `rough-${rawId}`;
  const maskId = `tornmask-${rawId}`;
  const gradId = `under-${rawId}`;

  return (
    <div
      role="img"
      aria-label={alt}
      className="relative h-[280px] w-full sm:h-[320px] lg:h-[360px]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, rotate: -1.2 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 1.1, delay, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-0"
        style={{ filter: "drop-shadow(0 22px 45px rgba(76,29,149,0.18))" }}
      >
        <svg
          className="h-full w-full overflow-visible"
          viewBox="0 0 560 320"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {/* Générateur de bords déchirés */}
            <filter id={roughId} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.028 0.05"
                numOctaves="4"
                seed="7"
                result="n"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="n"
                scale="20"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>

            {/* Masque déchiré (rect blanc passé au filtre) */}
            <mask id={maskId}>
              <rect
                x="14"
                y="14"
                width="532"
                height="292"
                fill="white"
                filter={`url(#${roughId})`}
              />
            </mask>

            {/* Sous-couche violette (comme le doré du modèle) */}
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="45%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>

          {/* Liseré papier blanc déchiré */}
          <rect
            x="6"
            y="6"
            width="548"
            height="308"
            fill="#ffffff"
            filter={`url(#${roughId})`}
          />

          {/* Contenu clippé par le masque déchiré */}
          <g mask={`url(#${maskId})`}>
            {/* Sous-couche violette révélée en premier */}
            <motion.rect
              x="14"
              y="14"
              width="532"
              height="292"
              fill={`url(#${gradId})`}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1.045, opacity: 1 }}
              transition={{
                duration: 1.6,
                delay: delay + 0.3,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />

            {/* Photo "collée" par-dessus, zoom dégressif */}
            <motion.image
              href={src}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid slice"
              initial={{ scale: 1.25, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 2, delay, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            />
          </g>
        </svg>
      </motion.div>

      {/* Badge soleil */}
      <div className="absolute left-[15%] top-[70%] z-30 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#ebe8ff] bg-white shadow-[0_12px_35px_rgba(65,71,150,0.16)] ring-1 ring-white sm:size-16">
        <Sun className="size-6 text-[#7567ef] sm:size-7" strokeWidth={1.6} />
      </div>
    </div>
  );
}
