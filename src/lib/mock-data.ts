// Dados de exemplo pra visualizar o design system antes de conectar o banco real.
// TODO: remover quando as queries do Prisma entrarem (etapa "página pública" com dados reais).

import type { TradePublico } from "@/components/public/TradeCard";

export const tradesMock: TradePublico[] = [
  {
    id: "1",
    data: "20/08/2026",
    ativo: "NQ",
    lado: "COMPRA",
    retornoPercentual: 2.14,
    resultadoPontos: 84,
    observacao: "Rompimento de máxima da manhã, gestão em 2 alvos",
  },
  {
    id: "2",
    data: "19/08/2026",
    ativo: "MNQ",
    lado: "VENDA",
    retornoPercentual: -0.68,
    resultadoPontos: -27,
    observacao: "Stop no suporte, mercado sem direção",
  },
  {
    id: "3",
    data: "18/08/2026",
    ativo: "NQ",
    lado: "COMPRA",
    retornoPercentual: 3.4,
    resultadoPontos: 134,
    observacao: null,
  },
  {
    id: "4",
    data: "15/08/2026",
    ativo: "ES",
    lado: "COMPRA",
    retornoPercentual: 1.05,
    resultadoPontos: 41,
    observacao: "Continuação de tendência",
  },
  {
    id: "5",
    data: "14/08/2026",
    ativo: "NQ",
    lado: "VENDA",
    retornoPercentual: 1.82,
    resultadoPontos: 71,
    observacao: null,
  },
];

export const curvaCapitalMock = [
  { data: "Mar", retornoAcumulado: 0 },
  { data: "Abr", retornoAcumulado: 4.2 },
  { data: "Mai", retornoAcumulado: 7.8 },
  { data: "Jun", retornoAcumulado: 6.1 },
  { data: "Jul", retornoAcumulado: 12.4 },
  { data: "Ago", retornoAcumulado: 18.9 },
];

export const statsMock = {
  winRate: 64.3,
  retornoAcumulado: 18.9,
  numeroTrades: 47,
  capitalTotalAcompanhamento: 842_300,
  numeroInvestidores: 11,
};
