"use client";

/**
 * Placeholder affiché pendant le chargement du modèle 3D.
 * Forme abstraite violet qui rappelle le laptop sans le bloquer.
 */
export default function LaptopPlaceholder() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      <div className="relative">
        {/* Halo pulsant */}
        <div className="absolute inset-0 animate-pulse rounded-3xl bg-gradient-to-br from-violet-200/60 to-indigo-200/40 blur-2xl" />

        {/* Rectangle abstrait (représente le laptop fermé) */}
        <div className="relative h-32 w-56 rounded-2xl border border-violet-200/50 bg-gradient-to-br from-white/80 to-violet-50/60 backdrop-blur-sm shadow-xl shadow-violet-500/10">
          {/* Ligne décorative centrale */}
          <div className="absolute left-1/2 top-1/2 h-px w-16 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-violet-300 to-transparent" />

          {/* Point de chargement */}
          <div className="absolute bottom-3 right-3 size-1.5 rounded-full bg-violet-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
