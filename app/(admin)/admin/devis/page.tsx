import { MessageCircle, Download, Mail } from "lucide-react";
import type { QuoteStatus } from "@prisma/client";
import { getAdminQuotes } from "@/src/server/modules/admin/service";
import { updateQuoteStatusAction } from "@/src/server/modules/admin/actions";
import { formatMGA } from "@/src/lib/pricing";

const STATUSES: QuoteStatus[] = [
  "DRAFT",
  "SUBMITTED",
  "EMAIL_SENT",
  "CONTACTED",
  "CONFIRMED",
  "CANCELLED",
  "ARCHIVED",
];

export default async function AdminDevisPage() {
  const quotes = await getAdminQuotes();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-zinc-900">
        Devis & prospects ({quotes.length})
      </h1>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
              <th className="px-5 py-3">Devis</th>
              <th className="px-5 py-3">Client</th>
              <th className="px-5 py-3">Séjour</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((q) => (
              <tr
                key={q.id}
                className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50"
              >
                <td className="px-5 py-3 font-mono text-xs font-bold text-zinc-700">
                  {q.quoteNumber}
                </td>
                <td className="px-5 py-3">
                  <div className="font-semibold text-zinc-900">
                    {q.clientName}
                  </div>
                  <div className="text-xs text-zinc-500">{q.clientEmail}</div>
                </td>
                <td className="px-5 py-3 text-xs text-zinc-500">
                  {q.arrivalDate?.toLocaleDateString("fr-FR")} →{" "}
                  {q.departureDate?.toLocaleDateString("fr-FR")}
                  <br />
                  {q.guests} pers. · {q.items.length} prestation(s)
                </td>
                <td className="px-5 py-3 font-bold text-zinc-900">
                  {formatMGA(q.total)}
                </td>
                <td className="px-5 py-3">
                  <form
                    action={updateQuoteStatusAction}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="id" value={q.id} />
                    <select
                      name="status"
                      defaultValue={q.status}
                      className="rounded-lg border border-zinc-200 bg-white px-2 py-1.5 text-xs font-semibold text-zinc-700 outline-none focus:border-violet-500"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button className="rounded-lg bg-violet-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-violet-700">
                      MAJ
                    </button>
                  </form>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${q.clientWhatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      className="rounded-lg bg-emerald-50 p-2 text-emerald-600 hover:bg-emerald-100"
                      title="WhatsApp"
                    >
                      <MessageCircle className="size-4" />
                    </a>
                    <a
                      href={`mailto:${q.clientEmail}`}
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                      title="Email"
                    >
                      <Mail className="size-4" />
                    </a>
                    <a
                      href={`/api/quotes/${q.token}/pdf`}
                      target="_blank"
                      className="rounded-lg bg-violet-50 p-2 text-violet-600 hover:bg-violet-100"
                      title="PDF"
                    >
                      <Download className="size-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
