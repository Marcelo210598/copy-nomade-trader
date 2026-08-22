import Link from "next/link";
import { startOfMonth, endOfMonth, subDays } from "date-fns";
import { Card } from "@/components/ui/Card";
import { PainelStatus } from "@/components/admin/PainelStatus";
import { SeletorPeriodo } from "@/components/admin/SeletorPeriodo";
import { MetricasPeriodo } from "@/components/admin/MetricasPeriodo";
import { prisma } from "@/lib/prisma";
import { calcularRange, periodoAnterior, diasUteisRestantesNoMes, type TipoPeriodo } from "@/lib/periodos";
import { calcularMetricasPeriodo, calcularMetricasSaude } from "@/lib/metricas-trade";
import { calcularSemaforo, parseThresholds } from "@/lib/semaforo-saude";

const TIPOS_VALIDOS: TipoPeriodo[] = ["diario", "semanal", "mensal", "semestral", "anual"];

export default async function DashboardAdminPage({
  searchParams,
}: {
  searchParams: { tipo?: string; ref?: string };
}) {
  const configGeral = await prisma.configGeral.findUnique({ where: { id: "config" } });

  if (!configGeral) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        </div>
        <Card>
          <p className="text-sm text-muted">
            Cadastre o capital de referência e a meta mensal em{" "}
            <Link href="/admin/configuracoes" className="text-accent hover:underline">
              Configurações
            </Link>{" "}
            pra ver as métricas aqui.
          </p>
        </Card>
      </div>
    );
  }

  const tipo: TipoPeriodo = TIPOS_VALIDOS.includes(searchParams.tipo as TipoPeriodo)
    ? (searchParams.tipo as TipoPeriodo)
    : "mensal";
  const dataReferencia = searchParams.ref ? new Date(`${searchParams.ref}T00:00:00`) : new Date();

  const rangeAtual = calcularRange(tipo, dataReferencia);
  const rangeAnterior = calcularRange(tipo, periodoAnterior(tipo, dataReferencia));
  const hoje = new Date();

  const [tradesAtual, tradesAnterior, tradesRecentes, tradesMes, total, publicados] =
    await Promise.all([
      prisma.trade.findMany({
        where: { data: { gte: rangeAtual.inicio, lte: rangeAtual.fim } },
        orderBy: { data: "asc" },
      }),
      prisma.trade.findMany({
        where: { data: { gte: rangeAnterior.inicio, lte: rangeAnterior.fim } },
      }),
      prisma.trade.findMany({
        where: { data: { gte: subDays(hoje, 30) } },
        orderBy: { data: "asc" },
      }),
      prisma.trade.findMany({
        where: { data: { gte: startOfMonth(hoje), lte: endOfMonth(hoje) } },
      }),
      prisma.trade.count(),
      prisma.trade.count({ where: { publicado: true } }),
    ]);

  const metricasPeriodo = calcularMetricasPeriodo(tradesAtual);
  const metricasAnterior = calcularMetricasPeriodo(tradesAnterior);
  const metricasSaude = calcularMetricasSaude(tradesRecentes);
  const thresholds = parseThresholds(configGeral.thresholdsSaude);
  const saude = calcularSemaforo(metricasSaude, thresholds);

  const resultadoMesAtual = tradesMes.reduce((acc, t) => acc + t.retornoPercentual, 0);
  const diasUteisRestantes = diasUteisRestantesNoMes(hoje);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          {total} trades lançados · {publicados} publicados
        </p>
      </div>

      <PainelStatus
        resultadoMesAtual={resultadoMesAtual}
        metaMensal={configGeral.metaMensalPercentual}
        diasUteisRestantes={diasUteisRestantes}
        saude={saude}
      />

      <SeletorPeriodo
        tipo={tipo}
        dataReferencia={dataReferencia.toISOString().slice(0, 10)}
        labelPeriodo={rangeAtual.label}
      />

      <MetricasPeriodo
        metricas={metricasPeriodo}
        resultadoAnterior={tradesAnterior.length > 0 ? metricasAnterior.resultadoPercentualTotal : null}
      />
    </div>
  );
}
