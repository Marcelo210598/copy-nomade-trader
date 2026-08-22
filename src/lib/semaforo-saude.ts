export type NivelSaude = "verde" | "amarelo" | "vermelho";

export interface ThresholdsSaude {
  winRateMinimoVerde: number;
  winRateMinimoAmarelo: number;
  expectanciaMinimaVerde: number;
  expectanciaMinimaAmarela: number;
  drawdownMaximoVerde: number;
  drawdownMaximoAmarelo: number;
}

export const THRESHOLDS_PADRAO: ThresholdsSaude = {
  winRateMinimoVerde: 55,
  winRateMinimoAmarelo: 40,
  expectanciaMinimaVerde: 0.3,
  expectanciaMinimaAmarela: 0,
  drawdownMaximoVerde: 10,
  drawdownMaximoAmarelo: 20,
};

/** Faz merge do JSON salvo em ConfigGeral.thresholdsSaude com os defaults (campo ausente/inválido cai no padrão). */
export function parseThresholds(json: unknown): ThresholdsSaude {
  if (!json || typeof json !== "object") return THRESHOLDS_PADRAO;
  const obj = json as Partial<Record<keyof ThresholdsSaude, unknown>>;

  const resultado = { ...THRESHOLDS_PADRAO };
  for (const chave of Object.keys(THRESHOLDS_PADRAO) as (keyof ThresholdsSaude)[]) {
    const valor = obj[chave];
    if (typeof valor === "number" && !Number.isNaN(valor)) {
      resultado[chave] = valor;
    }
  }
  return resultado;
}

/**
 * 🔴 se qualquer indicador está pior que o limiar "amarelo".
 * 🟢 se todos os indicadores batem o limiar "verde".
 * 🟡 no meio termo.
 */
export function calcularSemaforo(
  metricas: { winRate: number; expectancia: number; drawdownMaximo: number },
  thresholds: ThresholdsSaude
): NivelSaude {
  const vermelho =
    metricas.winRate < thresholds.winRateMinimoAmarelo ||
    metricas.expectancia < thresholds.expectanciaMinimaAmarela ||
    metricas.drawdownMaximo > thresholds.drawdownMaximoAmarelo;

  if (vermelho) return "vermelho";

  const verde =
    metricas.winRate >= thresholds.winRateMinimoVerde &&
    metricas.expectancia >= thresholds.expectanciaMinimaVerde &&
    metricas.drawdownMaximo <= thresholds.drawdownMaximoVerde;

  return verde ? "verde" : "amarelo";
}
