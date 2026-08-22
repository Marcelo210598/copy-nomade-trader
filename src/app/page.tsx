import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatNumber } from "@/components/ui/StatNumber";
import { Button } from "@/components/ui/Button";
import { TradeCard } from "@/components/public/TradeCard";
import { CurvaCapitalChart } from "@/components/charts/CurvaCapitalChart";
import { tradesMock, curvaCapitalMock, statsMock } from "@/lib/mock-data";
import { formatarMoeda, formatarPercentual } from "@/lib/utils";

export default function PaginaPublica() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent" />
            <span className="font-display text-sm font-semibold tracking-tight">
              Copy Nomade Trader
            </span>
          </div>
          <Link href="/investidor">
            <Button variant="secondary" size="sm">
              Área do investidor
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pb-10 pt-16">
        <p className="mb-3 font-tabular text-xs uppercase tracking-widest text-accent">
          Histórico verificado · operado ao vivo
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-[1.1] tracking-tight text-balance md:text-5xl">
          Resultado real, mostrado em público, trade a trade.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          Acompanhe o histórico de operações do Matheus em NQ, MNQ e ES.
          Sem promessa — números publicados conforme acontecem.
        </p>
      </section>

      {/* Capital sob acompanhamento */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <Card className="bg-gradient-to-br from-surface to-elevated">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Capital total sob acompanhamento
          </p>
          <div className="mt-2 flex items-baseline gap-3">
            <StatNumber
              value={formatarMoeda(statsMock.capitalTotalAcompanhamento)}
              tone="accent"
              size="xl"
            />
            <span className="font-tabular text-sm text-muted">
              {statsMock.numeroInvestidores} investidores acompanhando
            </span>
          </div>
          <p className="mt-3 text-xs text-muted">
            Valores simulados com base no capital informado por cada usuário — a
            plataforma não custodia nem movimenta dinheiro real.
          </p>
        </Card>
      </section>

      {/* KPIs */}
      <section className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-6 pb-10 md:grid-cols-4">
        <Card>
          <CardTitle>Win rate</CardTitle>
          <StatNumber value={`${statsMock.winRate.toString().replace(".", ",")}%`} size="md" />
        </Card>
        <Card>
          <CardTitle>Retorno acumulado</CardTitle>
          <StatNumber
            value={formatarPercentual(statsMock.retornoAcumulado)}
            tone="auto"
            size="md"
          />
        </Card>
        <Card>
          <CardTitle>Trades publicados</CardTitle>
          <StatNumber value={String(statsMock.numeroTrades)} size="md" />
        </Card>
        <Card>
          <CardTitle>Melhor trade</CardTitle>
          <StatNumber value="+3,40%" tone="profit" size="md" />
        </Card>
      </section>

      {/* Curva de capital */}
      <section className="mx-auto max-w-5xl px-6 pb-10">
        <Card>
          <CardHeader>
            <CardTitle>Curva de capital acumulada</CardTitle>
          </CardHeader>
          <CurvaCapitalChart dados={curvaCapitalMock} />
        </Card>
      </section>

      {/* Lista de trades */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <h2 className="mb-4 font-display text-lg font-semibold">Últimas operações</h2>
        <div className="flex flex-col gap-3">
          {tradesMock.map((trade) => (
            <TradeCard key={trade.id} trade={trade} />
          ))}
        </div>
      </section>
    </main>
  );
}
