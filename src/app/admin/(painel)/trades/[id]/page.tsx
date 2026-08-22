import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatNumber } from "@/components/ui/StatNumber";
import { prisma } from "@/lib/prisma";
import { formatarComSinal, formatarMoeda, formatarPercentual } from "@/lib/utils";

interface SnapshotTrade {
  data?: string;
  ativo?: string;
  lado?: "COMPRA" | "VENDA";
  precoEntrada?: number;
  precoSaida?: number;
  contratos?: number;
  observacao?: string | null;
  resultadoPontos?: number;
  resultadoDolar?: number;
  retornoPercentual?: number;
}

export default async function DetalheTradePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { editado?: string };
}) {
  const trade = await prisma.trade.findUnique({
    where: { id: params.id },
    include: { edicoes: { orderBy: { editadoEm: "desc" } } },
  });

  if (!trade) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">
            {trade.ativo} · {trade.data.toLocaleDateString("pt-BR")}
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="neutral">{trade.lado === "COMPRA" ? "Compra" : "Venda"}</Badge>
            <Badge variant={trade.publicado ? "profit" : "neutral"}>
              {trade.publicado ? "Publicado" : "Rascunho"}
            </Badge>
            {trade.editadoEm && <Badge variant="accent">Editado</Badge>}
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/trades">
            <Button variant="secondary">Voltar</Button>
          </Link>
          <Link href={`/admin/trades/${trade.id}/editar`}>
            <Button>Editar</Button>
          </Link>
        </div>
      </div>

      {searchParams.editado === "1" && (
        <p className="rounded-lg border border-accent/30 bg-accent-muted px-4 py-2 text-sm text-accent">
          Correção salva — o histórico abaixo guarda o valor anterior.
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Resultado atual</CardTitle>
        </CardHeader>
        <div className="flex items-baseline gap-4">
          <StatNumber value={formatarPercentual(trade.retornoPercentual)} tone="auto" size="lg" />
          <span className="font-tabular text-sm text-muted">
            {formatarComSinal(trade.resultadoPontos)} pts · {formatarMoeda(trade.resultadoDolar)}
          </span>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4 text-sm md:grid-cols-4">
          <Item label="Entrada" value={trade.precoEntrada.toString()} />
          <Item label="Saída" value={trade.precoSaida.toString()} />
          <Item label="Contratos" value={String(trade.contratos)} />
          <Item label="Editado em" value={trade.editadoEm ? trade.editadoEm.toLocaleString("pt-BR") : "—"} />
        </dl>

        {trade.observacao && (
          <p className="mt-4 border-t border-border pt-4 text-sm text-muted">{trade.observacao}</p>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de correções</CardTitle>
        </CardHeader>

        {trade.edicoes.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma correção registrada — trade como foi lançado.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {trade.edicoes.map((edicao) => {
              const anterior = edicao.valorAnterior as SnapshotTrade;
              const novo = edicao.valorNovo as SnapshotTrade;
              return (
                <div key={edicao.id} className="rounded-lg border border-border bg-elevated p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-tabular text-xs text-muted">
                      {edicao.editadoEm.toLocaleString("pt-BR")}
                    </span>
                    <Badge variant="accent">{edicao.campoAlterado}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-foreground">{edicao.motivo}</p>
                  <div className="mt-3 grid grid-cols-2 gap-4 border-t border-border pt-3 text-xs">
                    <div>
                      <p className="mb-1 uppercase tracking-wider text-muted">Antes</p>
                      <p className="font-tabular text-muted">
                        {anterior.precoEntrada} → {anterior.precoSaida} · {anterior.contratos}x ·{" "}
                        {anterior.retornoPercentual !== undefined
                          ? formatarPercentual(anterior.retornoPercentual)
                          : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 uppercase tracking-wider text-muted">Depois</p>
                      <p className="font-tabular text-foreground">
                        {novo.precoEntrada} → {novo.precoSaida} · {novo.contratos}x ·{" "}
                        {novo.retornoPercentual !== undefined
                          ? formatarPercentual(novo.retornoPercentual)
                          : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="font-tabular text-foreground">{value}</dd>
    </div>
  );
}
