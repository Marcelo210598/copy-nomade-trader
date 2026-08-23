import type { Trade } from "@prisma/client";

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
