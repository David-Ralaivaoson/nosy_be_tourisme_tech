import Link from "next/link";
import {
  LayoutDashboard,
  ClipboardList,
  BedDouble,
  Ticket,
  CarFront,
  ExternalLink,
  LogOut,
  Waves,
} from "lucide-react";
import { verifySession } from "@/src/server/auth/session";
import { logoutAction } from "@/src/server/modules/admin/actions";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/devis", label: "Devis", icon: ClipboardList },
  { href: "/admin/hebergements", label: "Hébergements", icon: BedDouble },
  { href: "/admin/excursions", label: "Excursions", icon: Ticket },
  { href: "/admin/transports", label: "Transports", icon: CarFront },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  // Pas de session → page login (rendue nue, sans shell)
  if (!session) return <>{children}</>;

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-zinc-200 bg-white">
        <div className="flex items-center gap-2.5 border-b border-zinc-100 px-5 py-4">
          <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
            <Waves className="size-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-900">
              Admin
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-violet-600">
              Sainte-Marie
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-violet-50 hover:text-violet-700"
            >
              <l.icon className="size-4" />
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 border-t border-zinc-100 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            <ExternalLink className="size-4" /> Voir le site
          </Link>
          <form action={logoutAction}>
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50">
              <LogOut className="size-4" /> Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* Contenu */}
      <main className="pl-60">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
