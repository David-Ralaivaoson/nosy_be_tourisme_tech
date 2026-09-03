import { redirect } from "next/navigation";
import { getAdminAccommodation } from "@/src/server/modules/admin/service";
import { saveAccommodationAction } from "@/src/server/modules/admin/actions";
import AdminForm from "@/src/components/admin/AdminForm";

const input =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";
const label =
  "mb-1 block text-xs font-bold uppercase tracking-wider text-zinc-500";

export default async function AdminAccommodationEditor({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const acc = isNew ? null : await getAdminAccommodation(id);
  if (!isNew && !acc) redirect("/admin/hebergements");

  return (
    <div className="max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold text-zinc-900">
        {isNew ? "Nouveau hébergement" : `Modifier : ${acc!.name}`}
      </h1>

      <AdminForm
        action={saveAccommodationAction}
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
      >
        {!isNew && <input type="hidden" name="id" value={acc!.id} />}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={label}>Nom *</label>
            <input
              name="name"
              required
              defaultValue={acc?.name ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Slug *</label>
            <input
              name="slug"
              required
              defaultValue={acc?.slug ?? ""}
              placeholder="mon-lodge"
              className={input}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className={label}>Catégorie</label>
            <select
              name="category"
              defaultValue={acc?.category ?? "HOTEL"}
              className={input}
            >
              {[
                "HOTEL",
                "BUNGALOW",
                "VILLA",
                "ECOLODGE",
                "LUXE",
                "GUEST_HOUSE",
              ].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label}>Zone</label>
            <select
              name="zone"
              defaultValue={acc?.zone ?? "CENTER"}
              className={input}
            >
              {["NORTH", "SOUTH", "WEST", "EAST", "CENTER"].map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <label className={label}>Prix basse (Ar)</label>
            <input
              name="pricePerNightLowSeason"
              type="number"
              required
              defaultValue={acc?.pricePerNightLowSeason ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Prix haute (Ar)</label>
            <input
              name="pricePerNightHighSeason"
              type="number"
              required
              defaultValue={acc?.pricePerNightHighSeason ?? ""}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Capacité</label>
            <input
              name="capacity"
              type="number"
              defaultValue={acc?.capacity ?? 2}
              className={input}
            />
          </div>
          <div>
            <label className={label}>Étoiles</label>
            <input
              name="stars"
              type="number"
              min={1}
              max={5}
              defaultValue={acc?.stars ?? 3}
              className={input}
            />
          </div>
        </div>

        <div>
          <label className={label}>
            Équipements (séparés par des virgules)
          </label>
          <input
            name="amenities"
            defaultValue={(acc?.amenities ?? []).join(", ")}
            placeholder="Wi-Fi, Piscine, Climatisation"
            className={input}
          />
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea
            name="descriptionFr"
            rows={4}
            defaultValue={acc?.descriptionFr ?? ""}
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
