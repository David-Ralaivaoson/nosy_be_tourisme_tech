"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Download,
  MessageCircle,
  Home,
  MailWarning,
  Sparkles,
} from "lucide-react";
import { formatMGA } from "@/src/lib/pricing";

interface LastQuote {
  number: string;
  token: string;
  total: number;
  name: string;
  email: string;
  emailSent: boolean;
}

const COLORS = [
  "#7c3aed",
  "#4f46e5",
  "#a78bfa",
  "#34d399",
  "#fbbf24",
  "#f472b6",
];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function MerciPage() {
  const router = useRouter();
  const [info, setInfo] = useState<LastQuote | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("sm-last-quote");
    if (!raw) {
      router.replace("/devis");
      return;
    }
    setInfo(JSON.parse(raw));
  }, [router]);

  /* 🎉 Confettis à l'arrivée */
  useEffect(() => {
    if (!info) return;

    const fire = (opts?: confetti.Options) =>
      confetti({ colors: COLORS, disableForReducedMotion: true, ...opts });

    // Burst central
    fire({ particleCount: 140, spread: 100, origin: { y: 0.62 }, scalar: 1.1 });

    // Pluie latérale pendant ~2,2 s
    const end = Date.now() + 2200;
    const frame = () => {
      fire({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
      });
      fire({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, [info]);

  if (!info) return null;

  const waMsg = encodeURIComponent(
    `Bonjour, je suis ${info.name}. Mon devis ${info.number} (${formatMGA(info.total)}) pour Sainte-Marie est prêt. Je souhaite confirmer ma réservation.`,
  );

  return (
    /* ✅ Centrage vertical sur tout l'écran */
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-28 text-center">
      {/* Halos décoratifs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-violet-200/40 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[300px] w-[420px] rounded-full bg-emerald-100/50 blur-[100px]" />

      {/* ✨ Sparkles flottants */}
      {[
        { left: "12%", top: "22%", delay: 0 },
        { left: "85%", top: "30%", delay: 0.8 },
        { left: "18%", top: "72%", delay: 1.4 },
        { left: "80%", top: "70%", delay: 0.4 },
      ].map((s, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute text-violet-400/70"
          style={{ left: s.left, top: s.top }}
          animate={{
            y: [0, -14, 0],
            opacity: [0.25, 0.8, 0.25],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="size-5" />
        </motion.span>
      ))}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex max-w-2xl flex-col items-center"
      >
        {/* ✅ Badge check animé (spring + trait dessiné) */}
        <motion.div variants={item} className="relative mb-8">
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-emerald-400/30 [animation-duration:1.6s]" />
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 240,
              damping: 16,
              delay: 0.2,
            }}
            className="flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-500/40"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth={2.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-12"
            >
              <motion.path
                d="M5 12.5l4.5 4.5L19 7.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.55, delay: 0.65, ease: "easeOut" }}
              />
            </svg>
          </motion.div>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-4xl font-black tracking-tight text-[#17123a] md:text-6xl"
        >
          Merci{" "}
          <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text font-serif font-medium italic text-transparent">
            {info.name}
          </span>{" "}
          !
        </motion.h1>

        <motion.p variants={item} className="mt-4 text-lg text-[#17123a]/60">
          Votre devis de{" "}
          <span className="font-black text-violet-600">
            {formatMGA(info.total)}
          </span>{" "}
          est prêt. 🎉
        </motion.p>

        {/* 🎫 Carte "ticket" du devis */}
        <motion.div
          variants={item}
          className="mt-6 flex items-center gap-5 rounded-2xl border border-dashed border-violet-300 bg-white/80 px-6 py-3 shadow-sm backdrop-blur"
        >
          <div className="text-left">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#17123a]/40">
              Devis N°
            </div>
            <div className="font-mono text-sm font-bold text-[#17123a]/80">
              {info.number}
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="text-left">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#17123a]/40">
              Total estimé
            </div>
            <div className="text-sm font-black text-violet-600">
              {formatMGA(info.total)}
            </div>
          </div>
        </motion.div>

        {info.emailSent ? (
          <motion.p
            variants={item}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-emerald-600"
          >
            <CheckCircle2 className="size-4" />
            Un exemplaire complet vient de vous être envoyé à {info.email}.
          </motion.p>
        ) : (
          <motion.p
            variants={item}
            className="mt-4 flex items-center gap-2 text-sm font-medium text-amber-600"
          >
            <MailWarning className="size-4" />
            L'envoi automatique n'a pas abouti — contactez-nous sur WhatsApp ou
            téléchargez votre PDF ci-dessous.
          </motion.p>
        )}

        <motion.div
          variants={item}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href={`/api/quotes/${info.token}/pdf`}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-700 hover:to-indigo-700"
          >
            <Download className="size-4" />
            Télécharger mon devis en PDF
          </a>

          <a
            href={`https://wa.me/261328030046?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition hover:opacity-90"
          >
            <MessageCircle className="size-4" />
            Confirmer sur WhatsApp
          </a>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-widest text-[#17123a]/70 shadow-sm transition hover:bg-slate-50"
          >
            <Home className="size-4" />
            Accueil
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
