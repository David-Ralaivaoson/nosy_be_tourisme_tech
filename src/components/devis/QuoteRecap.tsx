"use client";

import {
  CalendarDays,
  Users,
  BedDouble,
  Ticket,
  CarFront,
  X,
  AlertTriangle,
  Sparkles,
  Minus,
  Plus,
} from "lucide-react";
import type {
  Accommodation,
  AdditionalService,
  Excursion,
  TransportOption,
} from "@prisma/client";
import { useQuoteStore } from "@/src/store/quote-store";
import {
  calculateNights,
  calculateAccommodationTotal,
  formatMGA,
} from "@/src/lib/pricing";

interface Props {
  accommodations: Accommodation[];
  excursions: Excursion[];
  transports: TransportOption[];
  services: AdditionalService[];
}

function QtyStepper({
  value,
  onChange,
  min = 1,
  max = 20,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex size-6 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-violet-600"
      >
        <Minus className="size-3" />
      </button>
      <span className="w-6 text-center text-xs font-bold text-[#17123a]">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex size-6 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-violet-600"
      >
        <Plus className="size-3" />
      </button>
    </div>
  );
}

export default function QuoteRecap({
  accommodations,
  excursions,
  transports,
  services,
}: Props) {
  const {
    arrivalDate,
    departureDate,
    guests,
    setDates,
    accommodationId,
    setAccommodation,
    excursionIds,
    toggleExcursion,
    transportIds,
    toggleTransport,
    serviceIds,
    toggleService,
    itemQuantities,
    setItemQuantity,
  } = useQuoteStore();

  const today = new Date().toISOString().split("T")[0];
  const nights = calculateNights(arrivalDate, departureDate);

  const acc = accommodations.find((a) => a.id === accommodationId) ?? null;
  const accCalc = acc
    ? calculateAccommodationTotal(acc, arrivalDate, departureDate)
    : null;
  const selExc = excursions.filter((e) => excursionIds.includes(e.id));
  const selTr = transports.filter((t) => transportIds.includes(t.id));
  const selServ = services.filter((s) => serviceIds.includes(s.id));

  // Calcul du total dynamique basé sur les quantités custom
  let total = accCalc?.total ?? 0;
  selExc.forEach((e) => {
    total += e.pricePerPerson * (itemQuantities[e.id] ?? guests);
  });
  selTr.forEach((t) => {
    const def = t.unit === "DAY" ? Math.max(1, nights) : 1;
    total += t.price * (itemQuantities[t.id] ?? def);
  });
  selServ.forEach((s) => {
    let def = 1;
    if (s.unit === "PERSON") def = guests;
    else if (s.unit === "DAY") def = Math.max(1, nights);
    total += s.price * (itemQuantities[s.id] ?? def);
  });

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-[#17123a] outline-none transition focus:border-violet-300 focus:bg-white";

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-violet-900/5 lg:sticky lg:top-28">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#17123a]/70">
        <CalendarDays className="size-4 text-violet-600" /> Votre séjour
      </h3>

      <div className="mb-6 grid grid-cols-2 gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#17123a]/40">
            Arrivée
          </span>
          <input
            type="date"
            min={today}
            value={arrivalDate}
            onChange={(e) => setDates(e.target.value, departureDate, guests)}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#17123a]/40">
            Départ
          </span>
          <input
            type="date"
            min={arrivalDate || today}
            value={departureDate}
            onChange={(e) => setDates(arrivalDate, e.target.value, guests)}
            className={inputCls}
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#17123a]/40">
            <Users className="size-3" /> Voyageurs (Global)
          </span>
          <select
            value={guests}
            onChange={(e) =>
              setDates(arrivalDate, departureDate, +e.target.value)
            }
            className={inputCls}
          >
            {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} personne{n > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      {nights > 0 && (
        <div className="mb-4 rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700">
          {nights} nuit{nights > 1 ? "s" : ""} sur place
        </div>
      )}

      <div className="space-y-3 border-t border-slate-100 pt-4">
        {acc && (
          <Row
            icon={<BedDouble className="size-4 text-violet-600" />}
            label={acc.name}
            detail={
              nights > 0
                ? `${nights} nuit${nights > 1 ? "s" : ""} × ${formatMGA(accCalc?.averageRate ?? 0)}`
                : "Renseignez vos dates"
            }
            warn={nights === 0}
            amount={nights > 0 ? formatMGA(accCalc?.total ?? 0) : "—"}
            onRemove={() => setAccommodation(null)}
          />
        )}

        {selExc.map((e) => {
          const qty = itemQuantities[e.id] ?? guests;
          return (
            <Row
              key={e.id}
              icon={<Ticket className="size-4 text-blue-600" />}
              label={e.name}
              detail={`${formatMGA(e.pricePerPerson)} / pers.`}
              amount={formatMGA(e.pricePerPerson * qty)}
              onRemove={() => toggleExcursion(e.id)}
              stepper={
                <div className="flex items-center gap-2 text-xs text-[#17123a]/60">
                  <Users className="size-3" />
                  <QtyStepper
                    value={qty}
                    onChange={(v) => setItemQuantity(e.id, v)}
                    max={20}
                  />
                  <span>pers.</span>
                </div>
              }
            />
          );
        })}

        {selTr.map((t) => {
          const isDaily = t.unit === "DAY";
          const defaultQty = isDaily ? Math.max(1, nights) : 1;
          const qty = itemQuantities[t.id] ?? defaultQty;
          return (
            <Row
              key={t.id}
              icon={<CarFront className="size-4 text-emerald-600" />}
              label={t.name}
              detail={`${formatMGA(t.price)} ${isDaily ? "/ jour" : "/ trajet"}`}
              amount={formatMGA(t.price * qty)}
              onRemove={() => toggleTransport(t.id)}
              stepper={
                <div className="flex items-center gap-2 text-xs text-[#17123a]/60">
                  {isDaily ? (
                    <CalendarDays className="size-3" />
                  ) : (
                    <CarFront className="size-3" />
                  )}
                  <QtyStepper
                    value={qty}
                    onChange={(v) => setItemQuantity(t.id, v)}
                    max={isDaily ? 90 : 10}
                  />
                  <span>{isDaily ? "jours" : "trajets"}</span>
                </div>
              }
            />
          );
        })}

        {selServ.map((s) => {
          let defaultQty = 1;
          if (s.unit === "PERSON") defaultQty = guests;
          else if (s.unit === "DAY") defaultQty = Math.max(1, nights);
          const qty = itemQuantities[s.id] ?? defaultQty;

          return (
            <Row
              key={s.id}
              icon={<Sparkles className="size-4 text-pink-500" />}
              label={s.name}
              detail={`${formatMGA(s.price)} ${s.unit === "PERSON" ? "/ pers." : s.unit === "DAY" ? "/ jour" : "forfait"}`}
              amount={formatMGA(s.price * qty)}
              onRemove={() => toggleService(s.id)}
              stepper={
                <div className="flex items-center gap-2 text-xs text-[#17123a]/60">
                  <QtyStepper
                    value={qty}
                    onChange={(v) => setItemQuantity(s.id, v)}
                    max={s.unit === "DAY" ? 90 : 20}
                  />
                  <span>
                    {s.unit === "PERSON"
                      ? "pers."
                      : s.unit === "DAY"
                        ? "jours"
                        : "x"}
                  </span>
                </div>
              }
            />
          );
        })}

        {!acc &&
          selExc.length === 0 &&
          selTr.length === 0 &&
          selServ.length === 0 && (
            <p className="py-4 text-center text-sm text-[#17123a]/40">
              Votre devis est vide pour le moment.
            </p>
          )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <span className="text-sm font-semibold uppercase tracking-widest text-[#17123a]/60">
          Total estimé
        </span>
        <span className="text-2xl font-black text-violet-600">
          {formatMGA(total)}
        </span>
      </div>
      <p className="mt-2 text-[11px] text-[#17123a]/35">
        Estimation indicative — le montant final est vérifié côté serveur.
      </p>
    </div>
  );
}

function Row({
  icon,
  label,
  detail,
  amount,
  warn,
  onRemove,
  stepper,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  amount: string;
  warn?: boolean;
  onRemove: () => void;
  stepper?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-[#17123a]">
          {label}
        </div>
        <div
          className={
            "mt-0.5 flex items-center gap-1 text-xs " +
            (warn ? "text-amber-600" : "text-[#17123a]/45")
          }
        >
          {warn && <AlertTriangle className="size-3" />}
          {detail}
        </div>
        {stepper && <div className="mt-2">{stepper}</div>}
      </div>
      <div className="text-right flex flex-col items-end gap-1">
        <div className="text-sm font-bold text-[#17123a]">{amount}</div>
        <button
          onClick={onRemove}
          className="text-[#17123a]/30 transition hover:text-rose-500"
          aria-label={`Retirer ${label}`}
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
