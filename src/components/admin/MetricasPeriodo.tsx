import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatNumber } from "@/components/ui/StatNumber";
import { CurvaCapitalChart } from "@/components/charts/CurvaCapitalChart";
import { formatarPercentual } from "@/lib/utils";
import type { MetricasPeriodo as MetricasPeriodoType } from "@/lib/metricas-trade";

export function MetricasPeriodo({
  metricas,
  resultadoAnterior,
}: {
  metricas: MetricasPeriodoType;
  resultadoAnterior: number | null;
}) {
  const delta =
    resultadoAnterior !== null ? metricas.resultadoPercentualTotal - resultadoAnterior : null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Resultado do período</CardTitle>
          </CardHeader>
          <StatNumber
            value={formatarPercentual(metricas.resultadoPercentualTotal)}
            tone="auto"
            size="md"
          />
          {delta !== null && (
            <p className="mt-1.5 text-xs text-muted">
              vs. período anterior:{" "}
              <span className={delta >= 0 ? "text-profit" : "text-loss"}>
                {formatarPercentual(delta)}
              </span>
            </p>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trades</CardTitle>
          </CardHeader>
          <StatNumber value={String(metricas.quantidadeTrades)} size="md" />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Win rate</CardTitle>
          </CardHeader>
          <StatNumber value={`${metricas.winRate.toFixed(1).replace(".", ",")}%`} size="md" />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Melhor / pior</CardTitle>
          </CardHeader>
          <div className="flex items-baseline gap-2">
            <StatNumber
              value={metricas.melhorTrade !== null ? formatarPercentual(metricas.melhorTrade) : "—"}
              tone="auto"
              size="sm"
            />
            <span className="text-muted">/</span>
            <StatNumber
              value={metricas.piorTrade !== null ? formatarPercentual(metricas.piorTrade) : "—"}
              tone="auto"
              size="sm"
            />
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Curva de capital do período</CardTitle>
        </CardHeader>
        <CurvaCapitalChart
          dados={metricas.curvaCapital.map((p) => ({
            data: p.label,
            retornoAcumulado: p.retornoAcumulado,
          }))}
        />
      </Card>
    </div>
  );
}
