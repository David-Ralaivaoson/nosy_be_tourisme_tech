import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getAdminTransports } from "@/src/server/modules/admin/service";
import { deleteTransportAction } from "@/src/server/modules/admin/actions";
import { formatMGA } from "@/src/lib/pricing";

export default async function AdminTransportsPage() {
  const transports = await getAdminTransports();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">
          Transports ({transports.length})
        </h1>
        <Link
          href="/admin/transports/new"
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-500/20 hover:from-violet-700 hover:to-indigo-700"
        >
          <Plus className="size-4" /> Nouveau
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <table className="w-full min-w-[700px] text-sm">
          <thead>
            <tr className="border-b border-zinc-100 text-left text-xs font-bold uppercase tracking-wider text-zinc-500">
              <th className="px-5 py-3">Nom</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Tarif</th>
              <th className="px-5 py-3">Chauffeur</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transports.map((t) => (
              <tr
                key={t.id}
                className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50"
              >
                <td className="px-5 py-3 font-semibold text-zinc-900">
                  {t.name}
                </td>
                <td className="px-5 py-3 text-zinc-600">{t.transportType}</td>
                <td className="px-5 py-3 font-semibold text-zinc-900">
                  {formatMGA(t.price)}{" "}
                  <span className="text-xs font-normal text-zinc-500">
                    / {t.unit === "DAY" ? "jour" : "trajet"}
                  </span>
                </td>
                <td className="px-5 py-3 text-zinc-600">
                  {t.withDriver ? "Oui" : "Non"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/transports/${t.id}`}
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <form action={deleteTransportAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <button className="rounded-lg bg-rose-50 p-2 text-rose-600 hover:bg-rose-100">
                        <Trash2 className="size-4" />
                      </button>
                    </form>
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
