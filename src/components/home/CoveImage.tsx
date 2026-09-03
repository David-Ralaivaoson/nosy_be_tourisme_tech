"use client";

import { motion } from "framer-motion";
import type { CSSProperties } from "react";

/**
 * Crique du hero — effet "page déchirée" :
 * la photo (2e plan) émerge de la page (1er plan) comme un morceau
 * de papier déchiré qui se soulève.
 *
 * Seulement 2 couches visibles :
 *  1. fin bord papier blanc déchiré (le bord de la déchirure)
 *  2. photo clippée par le brush + léger ombrage interne (profondeur)
 * Le tout flotte au-dessus de la page grâce aux drop-shadows.
 */

const BRUSH = "/decor/BRUSH.png";

const maskStyle: CSSProperties = {
  WebkitMaskImage: `url(${BRUSH})`,
  maskImage: `url(${BRUSH})`,
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

export default function CoveImage() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute z-[5] hidden md:block"
      style={{
        top: "10vh",
        right: "-6vw",
        width: "42vw",
        height: "80vh",
        minWidth: 520,
        minHeight: 620,
      }}
    >
      <motion.div
        initial={{ opacity: 0, x: 90, rotate: 2, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full w-full"
        /* Double ombre : contact + flottement → le morceau "sort" de la page */
        style={{
          filter:
            "drop-shadow(0 2px 5px rgba(23,18,58,0.12)) drop-shadow(0 26px 55px rgba(76,29,149,0.18))",
        }}
      >
        {/* 1 ─ Bord papier déchiré (fine lisière blanche) */}
        <div
          className="absolute inset-0 scale-[1.02] bg-white"
          style={maskStyle}
        />

        {/* 2 ─ Photo : le plan déchiré qui émerge */}
        <div className="absolute inset-0" style={maskStyle}>
          <motion.img
            src="/textures/nosybe-activites.jpg"
            alt=""
            className="h-full w-full object-cover"
            initial={{ scale: 1.18, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1.8,
              delay: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
          />

          {/* Ombrage interne : donne la profondeur "sous la page" */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 58%, rgba(23,18,58,0.16) 100%)",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
