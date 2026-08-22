import type { Trade } from "@prisma/client";

export interface PontoCurva {
  label: string;
  retornoAcumulado: number;
}

export interface MetricasPeriodo {
  quantidadeTrades: number;
  winRate: number; // % de trades com retorno > 0
  resultadoPercentualTotal: number; // soma simples do retornoPercentual dos trades do período
  melhorTrade: number | null;
  piorTrade: number | null;
  curvaCapital: PontoCurva[];
}

export function calcularMetricasPeriodo(trades: Trade[]): MetricasPeriodo {
  if (trades.length === 0) {
    return {
      quantidadeTrades: 0,
      winRate: 0,
      resultadoPercentualTotal: 0,
      melhorTrade: null,
      piorTrade: null,
      curvaCapital: [{ label: "Início", retornoAcumulado: 0 }],
    };
  }

  const ordenados = [...trades].sort((a, b) => a.data.getTime() - b.data.getTime());

  const vencedores = ordenados.filter((t) => t.retornoPercentual > 0).length;
  const winRate = (vencedores / ordenados.length) * 100;

  const resultadoPercentualTotal = ordenados.reduce((acc, t) => acc + t.retornoPercentual, 0);
  const retornos = ordenados.map((t) => t.retornoPercentual);

  let acumulado = 0;
  const curvaCapital: PontoCurva[] = [
    { label: "Início", retornoAcumulado: 0 },
    ...ordenados.map((t) => {
      acumulado += t.retornoPercentual;
      return {
        label: t.data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
        retornoAcumulado: acumulado,
      };
    }),
  ];

  return {
    quantidadeTrades: ordenados.length,
    winRate,
    resultadoPercentualTotal,
    melhorTrade: Math.max(...retornos),
    piorTrade: Math.min(...retornos),
    curvaCapital,
  };
}

export interface MetricasSaude {
  expectancia: number; // pontos percentuais esperados por trade
  winRate: number;
  drawdownMaximo: number; // maior queda peak-to-trough, em pontos percentuais (valor positivo)
}

/** Métricas usadas pelo semáforo de saúde — calculadas sobre uma janela recente de trades. */
export function calcularMetricasSaude(tradesRecentes: Trade[]): MetricasSaude {
  if (tradesRecentes.length === 0) {
    return { expectancia: 0, winRate: 0, drawdownMaximo: 0 };
  }

  const vencedores = tradesRecentes.filter((t) => t.retornoPercentual > 0);
  const perdedores = tradesRecentes.filter((t) => t.retornoPercentual < 0);

  const winRate = (vencedores.length / tradesRecentes.length) * 100;
  const mediaGanho =
    vencedores.length > 0
      ? vencedores.reduce((acc, t) => acc + t.retornoPercentual, 0) / vencedores.length
      : 0;
  const mediaPerda =
    perdedores.length > 0
      ? Math.abs(perdedores.reduce((acc, t) => acc + t.retornoPercentual, 0) / perdedores.length)
      : 0;

  const probGanho = vencedores.length / tradesRecentes.length;
  const probPerda = perdedores.length / tradesRecentes.length;
  const expectancia = probGanho * mediaGanho - probPerda * mediaPerda;

  const ordenados = [...tradesRecentes].sort((a, b) => a.data.getTime() - b.data.getTime());
  let acumulado = 0;
  let pico = 0;
  let drawdownMaximo = 0;
  for (const t of ordenados) {
    acumulado += t.retornoPercentual;
    if (acumulado > pico) pico = acumulado;
    const drawdownAtual = pico - acumulado;
    if (drawdownAtual > drawdownMaximo) drawdownMaximo = drawdownAtual;
  }

  return { expectancia, winRate, drawdownMaximo };
}
