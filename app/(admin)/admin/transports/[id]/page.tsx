import { redirect } from "next/navigation";
import { getAdminTransport } from "@/src/server/modules/admin/service";
import { saveTransportAction } from "@/src/server/modules/admin/actions";
import AdminForm from "@/src/components/admin/AdminForm";

const input =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";
const label =
  "mb-1 block text-xs font-bold uppercase tracking-wider text-zinc-500";

export default async function AdminTransportEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const t = isNew ? null : await getAdminTransport(id);
  if (!isNew && !t) redirect("/admin/transports");

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900">
        {isNew ? "Nouveau transport" : `Modifier : ${t!.name}`}
      </h1>

      <AdminForm
        action={saveTransportAction}
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        {!isNew && <input type="hidden" name="id" value={t!.id} />}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={label}>Nom *</label>
            <input
              name="name"
              required
              defaultValue={t?.name ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Slug *</label>
            <input
              name="slug"
              required
              defaultValue={t?.slug ?? ""}
              className={input}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className={label}>Type</label>
            <select
              name="transportType"
              defaultValue={t?.transportType ?? "TRANSFER"}
              className={input}
            >
              <option value="TRANSFER">TRANSFER</option>
              <option value="VEHICLE_RENTAL">VEHICLE_RENTAL</option>
            </select>
          </div>
          <div>
            <label className={label}>Unité</label>
            <select
              name="unit"
              defaultValue={t?.unit ?? "TRIP"}
              className={input}
            >
              <option value="TRIP">TRIP</option>
              <option value="DAY">DAY</option>
            </select>
          </div>
          <div>
            <label className={label}>Prix (Ar)</label>
            <input
              name="price"
              type="number"
              required
              defaultValue={t?.price ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Capacité</label>
            <input
              name="capacity"
              type="number"
              defaultValue={t?.capacity ?? 4}
              className={input}
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            name="withDriver"
            defaultChecked={t?.withDriver ?? false}
            className="size-4 rounded border-zinc-300 accent-violet-600"
          />
          Avec chauffeur
        </label>

        <div>
          <label className={label}>Description</label>
          <textarea
            name="descriptionFr"
            rows={4}
            defaultValue={t?.descriptionFr ?? ""}
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
