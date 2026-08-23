import { prisma } from "@/lib/prisma";
import { calcularMetricasPeriodo } from "@/lib/metricas-trade";
import { calcularSaldoInvestidor, filtrarTradesDoInvestidor } from "@/lib/saldo-investidor";
import type { TradePublico } from "@/components/public/TradeCard";

export interface DadosPublicos {
  trades: TradePublico[];
  winRate: number;
  retornoAcumulado: number;
  numeroTrades: number;
  melhorTrade: number | null;
  curvaCapital: { data: string; retornoAcumulado: number }[];
  capitalTotalAcompanhamento: number;
  numeroInvestidores: number;
}

export async function buscarDadosPublicos(): Promise<DadosPublicos> {
  const [tradesPublicados, investidores] = await Promise.all([
    prisma.trade.findMany({ where: { publicado: true }, orderBy: { data: "asc" } }),
    prisma.user.findMany({ where: { capitalInicial: { not: null }, dataInicio: { not: null } } }),
  ]);

  const metricas = calcularMetricasPeriodo(tradesPublicados);

  // capital sob acompanhamento = soma do saldo atual (composto) de cada investidor que já fez onboarding
  let capitalTotalAcompanhamento = 0;
  for (const investidor of investidores) {
    if (!investidor.capitalInicial || !investidor.dataInicio) continue;
    const tradesDoDiaEmDiante = tradesPublicados.filter((t) => t.data >= investidor.dataInicio!);
    const tradesDoInvestidor = filtrarTradesDoInvestidor(tradesDoDiaEmDiante, {
      dataInicio: investidor.dataInicio!,
      entradaConfirmadaEm: investidor.entradaConfirmadaEm,
    });
    const saldo = calcularSaldoInvestidor(tradesDoInvestidor, investidor.capitalInicial);
    capitalTotalAcompanhamento += saldo.saldoAtualComposto;
  }

  const trades: TradePublico[] = [...tradesPublicados]
    .reverse() // mais recentes primeiro pra exibição
    .map((t) => ({
      id: t.id,
      data: t.data.toLocaleDateString("pt-BR"),
      ativo: t.ativo,
      lado: t.lado,
      retornoPercentual: t.retornoPercentual,
      resultadoPontos: t.resultadoPontos,
      observacao: t.observacao,
    }));

  return {
    trades,
    winRate: metricas.winRate,
    retornoAcumulado: metricas.resultadoPercentualTotal,
    numeroTrades: metricas.quantidadeTrades,
    melhorTrade: metricas.melhorTrade,
    curvaCapital: metricas.curvaCapital.map((p) => ({
      data: p.label,
      retornoAcumulado: p.retornoAcumulado,
    })),
    capitalTotalAcompanhamento,
    numeroInvestidores: investidores.length,
  };
}
