import Link from "next/link";
import { logoutInvestidor } from "./actions";

export default function AreaInvestidorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/investidor" className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-display text-sm font-semibold tracking-tight">
              Copy Nomade Trader
            </span>
          </Link>
          <form action={logoutInvestidor}>
            <button
              type="submit"
              className="text-sm text-muted transition-colors hover:text-loss"
            >
              Sair
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">{children}</div>
    </div>
  );
}
