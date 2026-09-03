import Link from "next/link";
import {
  ClipboardList,
  CheckCircle2,
  Banknote,
  BedDouble,
  Ticket,
  CarFront,
} from "lucide-react";
import { getDashboardStats } from "@/src/server/modules/admin/service";
import { formatMGA } from "@/src/lib/pricing";

export default async function AdminDashboard() {
  const s = await getDashboardStats();

  const cards = [
    {
      label: "Devis reçus",
      value: String(s.quotesCount),
      icon: ClipboardList,
      color: "text-violet-600 bg-violet-50",
    },
    {
      label: "Devis traités",
      value: String(s.sentCount),
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Réservations",
      value: String(s.confirmedCount),
      icon: CheckCircle2,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Volume estimé",
      value: formatMGA(s.totalRevenue),
      icon: Banknote,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Hébergements",
      value: String(s.accCount),
      icon: BedDouble,
      color: "text-violet-600 bg-violet-50",
    },
    {
      label: "Excursions",
      value: String(s.excCount),
      icon: Ticket,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Transports",
      value: String(s.trCount),
      icon: CarFront,
      color: "text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold text-zinc-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
          >
            <div
              className={`mb-3 inline-flex size-10 items-center justify-center rounded-xl ${c.color}`}
            >
              <c.icon className="size-5" />
            </div>
            <div className="text-xl font-bold text-zinc-900">{c.value}</div>
            <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">
              {c.label}
            </div>
          </div>
        ))}
      </div>

      {/* Derniers devis */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-700">
            Derniers devis
          </h2>
          <Link
            href="/admin/devis"
            className="text-xs font-semibold text-violet-600 hover:text-violet-700"
          >
            Tout voir →
          </Link>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {s.recent.map((q) => (
              <tr key={q.id} className="border-b border-zinc-50 last:border-0">
                <td className="px-5 py-3 font-mono text-xs font-bold text-zinc-700">
                  {q.quoteNumber}
                </td>
                <td className="px-5 py-3 text-zinc-600">{q.clientName}</td>
                <td className="px-5 py-3 text-zinc-500">
                  {q.items.length} prestation(s)
                </td>
                <td className="px-5 py-3 font-semibold text-zinc-900">
                  {formatMGA(q.total)}
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    {q.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
