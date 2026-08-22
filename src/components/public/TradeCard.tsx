import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { StatNumber } from "@/components/ui/StatNumber";
import { formatarPercentual } from "@/lib/utils";

export interface TradePublico {
  id: string;
  data: string;
  ativo: string;
  lado: "COMPRA" | "VENDA";
  retornoPercentual: number;
  resultadoPontos: number;
  observacao?: string | null;
}

export function TradeCard({ trade }: { trade: TradePublico }) {
  const positivo = trade.retornoPercentual >= 0;

  return (
    <Card hover className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-tabular text-xs font-semibold"
          style={{
            borderColor: positivo ? "rgba(52,211,153,0.3)" : "rgba(240,85,62,0.3)",
            color: positivo ? "#34D399" : "#F0553E",
            background: positivo ? "rgba(52,211,153,0.08)" : "rgba(240,85,62,0.08)",
          }}
        >
          {trade.ativo}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="neutral">{trade.lado === "COMPRA" ? "Compra" : "Venda"}</Badge>
            <span className="font-tabular text-xs text-muted">{trade.data}</span>
          </div>
          {trade.observacao && (
            <p className="mt-1 max-w-xs truncate text-xs text-muted">{trade.observacao}</p>
          )}
        </div>
      </div>

      <div className="text-right">
        <StatNumber
          value={formatarPercentual(trade.retornoPercentual)}
          tone="auto"
          size="md"
        />
        <p className="mt-0.5 font-tabular text-xs text-muted">
          {trade.resultadoPontos > 0 ? "+" : ""}
          {trade.resultadoPontos.toLocaleString("pt-BR")} pts
        </p>
      </div>
    </Card>
  );
}
