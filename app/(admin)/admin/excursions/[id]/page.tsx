import { redirect } from "next/navigation";
import { getAdminExcursion } from "@/src/server/modules/admin/service";
import { saveExcursionAction } from "@/src/server/modules/admin/actions";
import AdminForm from "@/src/components/admin/AdminForm";

const input =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";
const label =
  "mb-1 block text-xs font-bold uppercase tracking-wider text-zinc-500";

export default async function AdminExcursionEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const exc = isNew ? null : await getAdminExcursion(id);
  if (!isNew && !exc) redirect("/admin/excursions");

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900">
        {isNew ? "Nouvelle excursion" : `Modifier : ${exc!.name}`}
      </h1>

      <AdminForm
        action={saveExcursionAction}
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        {!isNew && <input type="hidden" name="id" value={exc!.id} />}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={label}>Nom *</label>
            <input
              name="name"
              required
              defaultValue={exc?.name ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Slug *</label>
            <input
              name="slug"
              required
              defaultValue={exc?.slug ?? ""}
              className={input}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={label}>Prix / personne (Ar)</label>
            <input
              name="pricePerPerson"
              type="number"
              required
              defaultValue={exc?.pricePerPerson ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Durée</label>
            <input
              name="duration"
              required
              defaultValue={exc?.duration ?? ""}
              placeholder="4 heures"
              className={input}
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              name="includesLunch"
              defaultChecked={exc?.includesLunch ?? false}
              className="size-4 rounded border-zinc-300 accent-violet-600"
            />
            Déjeuner inclus
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-700">
            <input
              type="checkbox"
              name="includesTransfer"
              defaultChecked={exc?.includesTransfer ?? false}
              className="size-4 rounded border-zinc-300 accent-violet-600"
            />
            Transfert inclus
          </label>
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea
            name="descriptionFr"
            rows={4}
            defaultValue={exc?.descriptionFr ?? ""}
            className={input + " resize-none"}
          />
        </div>

        <button className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-500/20 hover:from-violet-700 hover:to-indigo-700">
          Enregistrer
        </button>
      </AdminForm>
    </div>
  );
}
