import type { Trade } from "@prisma/client";

function inicioDoDia(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/**
 * Decide se um trade conta pro saldo do investidor.
 *
 * Regra: trades de dias depois de `dataInicio` sempre contam; de dias antes,
 * nunca contam. No MESMO dia de `dataInicio`, só desempata por horário de
 * lançamento (`trade.criadoEm`) quando `dataInicio` é o próprio dia em que o
 * investidor confirmou a entrada — aí um trade lançado antes da confirmação
 * (ex: já existia no sistema quando ele entrou) não conta, e um lançado
 * depois conta, mesmo sendo o mesmo dia. Se `dataInicio` for uma data
 * retroativa, todos os trades daquele dia contam (sem essa granularidade).
 */
export function tradeContaParaInvestidor(
  trade: Pick<Trade, "data" | "criadoEm">,
  investidor: { dataInicio: Date; entradaConfirmadaEm: Date | null },
): boolean {
  const diaTrade = inicioDoDia(trade.data);
  const diaInicio = inicioDoDia(investidor.dataInicio);

  if (diaTrade > diaInicio) return true;
  if (diaTrade < diaInicio) return false;

  // mesmo dia
  if (!investidor.entradaConfirmadaEm) return true; // dado antigo sem esse campo: mantém comportamento anterior
  const diaConfirmacao = inicioDoDia(investidor.entradaConfirmadaEm);
  if (diaConfirmacao !== diaInicio) return true; // entrada retroativa: todo o dia conta

  return trade.criadoEm >= investidor.entradaConfirmadaEm;
}

export function filtrarTradesDoInvestidor<T extends Pick<Trade, "data" | "criadoEm">>(
  trades: T[],
  investidor: { dataInicio: Date; entradaConfirmadaEm: Date | null },
): T[] {
  return trades.filter((t) => tradeContaParaInvestidor(t, investidor));
}

export interface PontoSaldo {
  label: string;
  saldoComposto: number;
  saldoLinear: number;
}

export interface ResultadoSaldo {
  saldoAtualComposto: number;
  saldoAtualLinear: number;
  retornoComposto: number; // %
  retornoLinear: number; // %
  evolucao: PontoSaldo[];
}

/**
 * Composto: reaplica o % de cada trade sobre o saldo acumulado (juros compostos).
 * Linear: aplica sempre sobre o capital inicial original (soma simples dos %).
 *
 * `trades` já deve vir filtrado (publicados, data >= dataInicio do investidor) e ordenado por data asc.
 */
export function calcularSaldoInvestidor(trades: Trade[], capitalInicial: number): ResultadoSaldo {
  let saldoComposto = capitalInicial;
  let somaRetornos = 0;

  const evolucao: PontoSaldo[] = [
    { label: "Início", saldoComposto: capitalInicial, saldoLinear: capitalInicial },
  ];

  const ordenados = [...trades].sort((a, b) => a.data.getTime() - b.data.getTime());

  for (const trade of ordenados) {
    saldoComposto *= 1 + trade.retornoPercentual / 100;
    somaRetornos += trade.retornoPercentual;
    const saldoLinear = capitalInicial * (1 + somaRetornos / 100);

    evolucao.push({
      label: trade.data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      saldoComposto,
      saldoLinear,
    });
  }

  const saldoAtualLinear = capitalInicial * (1 + somaRetornos / 100);

  return {
    saldoAtualComposto: saldoComposto,
    saldoAtualLinear,
    retornoComposto: capitalInicial > 0 ? ((saldoComposto - capitalInicial) / capitalInicial) * 100 : 0,
    retornoLinear: somaRetornos,
    evolucao,
  };
}
