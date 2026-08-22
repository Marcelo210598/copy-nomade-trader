import { Card } from "@/components/ui/Card";
import { StatNumber } from "@/components/ui/StatNumber";
import { cn, formatarPercentual } from "@/lib/utils";
import type { NivelSaude } from "@/lib/semaforo-saude";

const EMOJI_SAUDE: Record<NivelSaude, string> = {
  verde: "🟢",
  amarelo: "🟡",
  vermelho: "🔴",
};

const LABEL_SAUDE: Record<NivelSaude, string> = {
  verde: "Saudável",
  amarelo: "Atenção",
  vermelho: "Alerta",
};

export function PainelStatus({
  resultadoMesAtual,
  metaMensal,
  diasUteisRestantes,
  saude,
}: {
  resultadoMesAtual: number;
  metaMensal: number;
  diasUteisRestantes: number;
  saude: NivelSaude;
}) {
  const progresso =
    metaMensal > 0 ? Math.min(100, Math.max(0, (resultadoMesAtual / metaMensal) * 100)) : 0;

  return (
    <Card className="flex flex-wrap items-center justify-between gap-6">
      <div className="min-w-[240px] flex-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">Meta mensal</p>
        <div className="mt-2 flex items-baseline gap-2">
          <StatNumber value={formatarPercentual(resultadoMesAtual)} tone="auto" size="md" />
          <span className="font-tabular text-sm text-muted">
            de {metaMensal.toString().replace(".", ",")}%
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-elevated">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              resultadoMesAtual >= 0 ? "bg-profit" : "bg-loss"
            )}
            style={{ width: `${progresso}%` }}
          />
        </div>
        <p className="mt-1.5 text-xs text-muted">
          Faltam {diasUteisRestantes} dia{diasUteisRestantes === 1 ? "" : "s"} útil
          {diasUteisRestantes === 1 ? "" : "eis"} do mês
        </p>
      </div>

      <div className="text-center">
        <p className="text-xs font-medium uppercase tracking-wider text-muted">Saúde</p>
        <p className="mt-2 text-4xl leading-none">{EMOJI_SAUDE[saude]}</p>
        <p className="mt-1.5 text-xs text-muted">{LABEL_SAUDE[saude]}</p>
      </div>
    </Card>
  );
}
