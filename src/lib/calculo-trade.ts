export interface EntradaCalculoTrade {
  lado: "COMPRA" | "VENDA";
  precoEntrada: number;
  precoSaida: number;
  contratos: number;
  valorPorPonto: number;
  capitalReferencia: number;
}

export interface ResultadoCalculoTrade {
  resultadoPontos: number; // movimento de preço (independente da quantidade de contratos)
  resultadoDolar: number; // resultadoPontos * valorPorPonto * contratos
  retornoPercentual: number; // resultadoDolar / capitalReferencia * 100
}

/**
 * Regra de negócio central do lançamento de trade.
 * Compra: lucro quando saída > entrada. Venda: lucro quando saída < entrada.
 */
export function calcularResultadoTrade({
  lado,
  precoEntrada,
  precoSaida,
  contratos,
  valorPorPonto,
  capitalReferencia,
}: EntradaCalculoTrade): ResultadoCalculoTrade {
  const sinal = lado === "COMPRA" ? 1 : -1;
  const resultadoPontos = (precoSaida - precoEntrada) * sinal;
  const resultadoDolar = resultadoPontos * valorPorPonto * contratos;
  const retornoPercentual =
    capitalReferencia > 0 ? (resultadoDolar / capitalReferencia) * 100 : 0;

  return { resultadoPontos, resultadoDolar, retornoPercentual };
}
