import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { logoutInvestidor } from "./actions";

export default async function AreaInvestidorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // busca do banco em vez de confiar no JWT: o token não recarrega sozinho
  // depois que o onboarding atualiza o nome no banco
  const investidor = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { name: true },
      })
    : null;
  const primeiroNome = investidor?.name?.split(" ")[0];

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
          <div className="flex items-center gap-4">
            {primeiroNome && <span className="text-sm text-muted">Olá, {primeiroNome}</span>}
            <form action={logoutInvestidor}>
              <button
                type="submit"
                className="text-sm text-muted transition-colors hover:text-loss"
              >
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-8">{children}</div>
    </div>
  );
}
