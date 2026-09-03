"use client";

import { motion } from "framer-motion";
import WaveHeroImage from "@/src/components/hebergements/WaveHeroImage";

interface PageHeroProps {
  badgeIcon: React.ReactNode;
  badgeLabel: string;
  titleTop: string;
  titleAccent: string;
  description: string;
  image: string;
  imageAlt: string;
}

export default function PageHero({
  badgeIcon,
  badgeLabel,
  titleTop,
  titleAccent,
  description,
  image,
  imageAlt,
}: PageHeroProps) {
  return (
    <div className="mb-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-white px-4 py-1.5 shadow-sm shadow-violet-900/5">
          {badgeIcon}
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-600">
            {badgeLabel}
          </span>
        </div>

        <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-[#17123a] md:text-6xl">
          {titleTop}
          <span className="mt-1 block font-serif text-4xl italic font-medium text-violet-500 md:text-6xl">
            {titleAccent}
          </span>
        </h1>

        <p className="mt-6 max-w-md text-base leading-relaxed text-[#17123a]/55 md:text-lg">
          {description}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <WaveHeroImage src={image} alt={imageAlt} />
      </motion.div>
    </div>
  );
}
