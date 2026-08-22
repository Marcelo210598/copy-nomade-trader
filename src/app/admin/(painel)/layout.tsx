import { AdminNav } from "@/components/admin/AdminNav";
import { logoutAdmin } from "./actions";

export default function PainelAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-60 shrink-0 flex-col justify-between border-r border-border p-4">
        <div>
          <div className="mb-6 flex items-center gap-2 px-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-display text-sm font-semibold tracking-tight">
              Copy Nomade Trader
            </span>
          </div>
          <AdminNav />
        </div>

        <form action={logoutAdmin}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted transition-colors hover:bg-elevated hover:text-loss"
          >
            Sair
          </button>
        </form>
      </aside>

      <div className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-4xl px-8 py-8">{children}</div>
      </div>
    </div>
  );
}
