import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatNumber } from "@/components/ui/StatNumber";
import { prisma } from "@/lib/prisma";
import { formatarPercentual } from "@/lib/utils";
import { alternarPublicado } from "./actions";

export default async function TradesPage({
  searchParams,
}: {
  searchParams: { criado?: string };
}) {
  const trades = await prisma.trade.findMany({ orderBy: { data: "desc" } });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold">Trades</h1>
          <p className="mt-1 text-sm text-muted">{trades.length} lançados no total</p>
        </div>
        <Link href="/admin/trades/novo">
          <Button>Lançar trade</Button>
        </Link>
      </div>

      {searchParams.criado === "1" && (
        <p className="rounded-lg border border-profit/30 bg-profit/10 px-4 py-2 text-sm text-profit">
          Trade lançado com sucesso.
        </p>
      )}

      {trades.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">Nenhum trade lançado ainda.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {trades.map((trade) => (
            <Card key={trade.id} className="flex items-center justify-between gap-4">
              <Link
                href={`/admin/trades/${trade.id}`}
                className="flex flex-1 items-center gap-4 rounded-lg transition-colors hover:opacity-80"
              >
                <span className="w-12 font-tabular text-sm font-semibold">{trade.ativo}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="neutral">
                      {trade.lado === "COMPRA" ? "Compra" : "Venda"}
                    </Badge>
                    <span className="font-tabular text-xs text-muted">
                      {trade.data.toLocaleDateString("pt-BR")}
                    </span>
                    {trade.editadoEm && <Badge variant="accent">Editado</Badge>}
                  </div>
                  {trade.observacao && (
                    <p className="mt-1 max-w-xs truncate text-xs text-muted">
                      {trade.observacao}
                    </p>
                  )}
                </div>
              </Link>

              <div className="flex items-center gap-4">
                <StatNumber
                  value={formatarPercentual(trade.retornoPercentual)}
                  tone="auto"
                  size="sm"
                />
                <form action={alternarPublicado.bind(null, trade.id)}>
                  <Button
                    type="submit"
                    variant={trade.publicado ? "secondary" : "primary"}
                    size="sm"
                  >
                    {trade.publicado ? "Publicado" : "Rascunho"}
                  </Button>
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
