import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { OnboardingForm } from "@/components/investidor/OnboardingForm";
import { SaldoComparativo } from "@/components/investidor/SaldoComparativo";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcularSaldoInvestidor, filtrarTradesDoInvestidor } from "@/lib/saldo-investidor";

export const dynamic = "force-dynamic";

export default async function AreaInvestidorPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/investidor/login");

  const investidor = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!investidor) redirect("/investidor/login");

  if (!investidor.capitalInicial || !investidor.dataInicio) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Bem-vindo(a)</h1>
          <p className="mt-1 text-sm text-muted">
            Antes de ver seu saldo, conta pra gente teu capital inicial e desde quando você tá
            acompanhando.
          </p>
        </div>
        <Card>
          <OnboardingForm />
        </Card>
      </div>
    );
  }

  const tradesDoDiaEmDiante = await prisma.trade.findMany({
    where: { publicado: true, data: { gte: investidor.dataInicio } },
    orderBy: { data: "asc" },
  });

  const trades = filtrarTradesDoInvestidor(tradesDoDiaEmDiante, {
    dataInicio: investidor.dataInicio,
    entradaConfirmadaEm: investidor.entradaConfirmadaEm,
  });
  const resultado = calcularSaldoInvestidor(trades, investidor.capitalInicial);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Seu saldo</h1>
        <p className="mt-1 text-sm text-muted">
          Acompanhando desde {investidor.dataInicio.toLocaleDateString("pt-BR")} · {trades.length}{" "}
          trades considerados
        </p>
      </div>

      <SaldoComparativo resultado={resultado} />
    </div>
  );
}
