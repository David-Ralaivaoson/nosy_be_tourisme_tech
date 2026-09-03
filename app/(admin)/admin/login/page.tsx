"use client";

import { useActionState } from "react";
import { Waves, Lock } from "lucide-react";
import { loginAction } from "@/src/server/modules/admin/actions";
import AdminForm from "@/src/components/admin/AdminForm";

const input =
  "w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/20">
            <Waves className="size-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900">Administration</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Sainte-Marie Travel — Back-office
          </p>
        </div>

        <AdminForm
          action={loginAction}
          className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-zinc-500">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className={input}
              placeholder="admin@sainte-marie.mg"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-zinc-500">
              Mot de passe
            </label>
            <input
              name="password"
              type="password"
              required
              className={input}
              placeholder="••••••••"
            />
          </div>
          <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-bold text-white shadow-md shadow-violet-500/20 transition hover:from-violet-700 hover:to-indigo-700">
            <Lock className="size-4" /> Se connecter
          </button>
        </AdminForm>

        <p className="mt-4 text-center text-xs text-zinc-400">
          Défaut : admin@sainte-marie.mg / admin123
        </p>
      </div>
    </main>
  );
}
