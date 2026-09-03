"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Compass } from "lucide-react";
import { useQuoteStore } from "@/src/store/quote-store";

const field =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

export default function QuickConfigurator() {
  const router = useRouter();
  const setDates = useQuoteStore((s) => s.setDates);

  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState(2);
  const [theme, setTheme] = useState("decouverte");

  const today = new Date().toISOString().split("T")[0];

  const start = () => {
    if (arrival && departure) setDates(arrival, departure, guests);
    if (theme === "baleines") router.push("/excursions");
    else if (theme === "complet") router.push("/devis");
    else router.push("/hebergements");
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/60 md:p-8">
      <div className="mb-5 flex items-center gap-2">
        <Compass className="size-5 text-violet-600" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-700">
          Configurateur rapide
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Arrivée
          </span>
          <input
            type="date"
            min={today}
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
            className={field}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Départ
          </span>
          <input
            type="date"
            min={arrival || today}
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
            className={field}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Voyageurs
          </span>
          <select
            value={guests}
            onChange={(e) => setGuests(+e.target.value)}
            className={field}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} personne{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Thématique
          </span>
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className={field}
          >
            <option value="decouverte">Découverte & plages</option>
            <option value="baleines">Safari baleines</option>
            <option value="complet">Tout composer moi-même</option>
          </select>
        </label>
      </div>

      <button
        onClick={start}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-700 hover:to-indigo-700"
      >
        Commencer mon voyage <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
