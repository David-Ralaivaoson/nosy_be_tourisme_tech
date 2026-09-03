import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { getAdminExcursions } from "@/src/server/modules/admin/service";
import { deleteExcursionAction } from "@/src/server/modules/admin/actions";
import { formatMGA } from "@/src/lib/pricing";

export default async function AdminExcursionsPage() {
  const excursions = await getAdminExcursions();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">
          Excursions ({excursions.length})
        </h1>
        <Link
          href="/admin/excursions/new"
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
              <th className="px-5 py-3">Durée</th>
              <th className="px-5 py-3">Prix / pers.</th>
              <th className="px-5 py-3">Inclus</th>
              <th className="px-5 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {excursions.map((e) => (
              <tr
                key={e.id}
                className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50"
              >
                <td className="px-5 py-3 font-semibold text-zinc-900">
                  {e.name}
                </td>
                <td className="px-5 py-3 text-zinc-600">{e.duration}</td>
                <td className="px-5 py-3 font-semibold text-zinc-900">
                  {formatMGA(e.pricePerPerson)}
                </td>
                <td className="px-5 py-3 text-xs text-zinc-500">
                  {e.includesLunch && "🍽 Déjeuner "}
                  {e.includesTransfer && "🚗 Transfert"}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/excursions/${e.id}`}
                      className="rounded-lg bg-blue-50 p-2 text-blue-600 hover:bg-blue-100"
                    >
                      <Pencil className="size-4" />
                    </Link>
                    <form action={deleteExcursionAction}>
                      <input type="hidden" name="id" value={e.id} />
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
