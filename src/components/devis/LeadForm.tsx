"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Send } from "lucide-react";
import { createQuoteSchema } from "@/src/lib/validators/quote.schema";
import { useQuoteStore } from "@/src/store/quote-store";

export default function LeadForm({ canSubmit }: { canSubmit: boolean }) {
  const router = useRouter();
  const store = useQuoteStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputCls =
    "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#17123a] outline-none transition focus:border-violet-300 focus:bg-white";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const payload = {
      clientName: form.name.trim(),
      clientEmail: form.email.trim(),
      clientWhatsapp: form.whatsapp.trim(),
      arrivalDate: store.arrivalDate,
      departureDate: store.departureDate,
      guests: store.guests,
      accommodationId: store.accommodationId,
      excursionIds: store.excursionIds,
      transportIds: store.transportIds,
      serviceIds: store.serviceIds,
      itemQuantities: store.itemQuantities,
      notes: form.notes.trim() || undefined,
    };

    const parsed = createQuoteSchema.safeParse(payload);
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          parsed.error.issues.map((i) => [String(i.path[0]), i.message]),
        ),
      );
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.ok) {
        if (data.fields) {
          setErrors(
            Object.fromEntries(
              Object.entries(data.fields).map(([k, v]) => [
                k,
                (v as string[])[0],
              ]),
            ),
          );
        }
        setServerError(data.error ?? "Une erreur est survenue.");
        return;
      }

      sessionStorage.setItem(
        "sm-last-quote",
        JSON.stringify({
          number: data.quoteNumber,
          token: data.token,
          total: data.total,
          name: form.name.trim(),
          email: form.email.trim(),
          emailSent: Boolean(data.emailSent),
        }),
      );
      store.reset();
      router.push("/devis/merci");
    } catch {
      setServerError("Impossible de contacter le serveur. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm shadow-violet-900/5">
      <div className="mb-1 flex items-center gap-2 text-violet-600">
        <Lock className="size-4" />
        <h3 className="text-sm font-bold uppercase tracking-widest">
          Recevez votre devis détaillé
        </h3>
      </div>
      <p className="mb-6 text-sm text-[#17123a]/50">
        Consultez votre devis complet, recevez votre itinéraire par email et
        téléchargez-le en PDF.
      </p>

      <form onSubmit={submit} className="space-y-4">
        <div>
          <input
            placeholder="Nom complet *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputCls}
          />
          {errors.clientName && (
            <p className="mt-1 text-xs text-rose-500">{errors.clientName}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            placeholder="Adresse email *"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputCls}
          />
          {errors.clientEmail && (
            <p className="mt-1 text-xs text-rose-500">{errors.clientEmail}</p>
          )}
        </div>

        <div>
          <input
            placeholder="Numéro WhatsApp * (ex : +261 32 ...)"
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            className={inputCls}
          />
          {errors.clientWhatsapp && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.clientWhatsapp}
            </p>
          )}
        </div>

        <div>
          <textarea
            rows={3}
            placeholder="Précisions (optionnel) : chambre vue mer, régime végétarien..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className={inputCls + " resize-none"}
          />
        </div>

        {serverError && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-600">
            {serverError}
          </div>
        )}

        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg shadow-violet-500/25 transition hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Valider & recevoir mon devis
        </button>

        {!canSubmit && (
          <p className="text-center text-xs text-[#17123a]/40">
            Ajoutez au moins une prestation et vos dates de séjour pour valider.
          </p>
        )}
      </form>
    </div>
  );
}
