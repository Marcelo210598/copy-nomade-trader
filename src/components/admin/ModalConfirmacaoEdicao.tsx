"use client";

import { Button } from "@/components/ui/Button";
import { StatNumber } from "@/components/ui/StatNumber";
import { formatarComSinal, formatarMoeda, formatarPercentual } from "@/lib/utils";
import type { ResultadoCalculoTrade } from "@/lib/calculo-trade";

export function ModalConfirmacaoEdicao({
  motivo,
  resultado,
  onConfirmar,
  onCancelar,
}: {
  motivo: string;
  resultado: ResultadoCalculoTrade;
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onCancelar}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Confirme a correção
        </p>

        <div className="mt-4 text-center">
          <StatNumber
            value={formatarPercentual(resultado.retornoPercentual)}
            tone="auto"
            size="xl"
          />
          <p className="mt-1 font-tabular text-sm text-muted">
            {formatarComSinal(resultado.resultadoPontos)} pts ·{" "}
            {formatarMoeda(resultado.resultadoDolar)}
          </p>
          <p className="mt-1 text-xs text-muted">novo resultado, após a correção</p>
        </div>

        <div className="mt-6 border-t border-border pt-4">
          <p className="text-xs text-muted">Motivo registrado no histórico:</p>
          <p className="mt-1 text-sm text-foreground">{motivo}</p>
        </div>

        <p className="mt-4 text-xs text-muted">
          O valor anterior fica salvo no histórico de correções — nada é sobrescrito
          silenciosamente.
        </p>

        <div className="mt-6 flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={onCancelar}>
            Cancelar
          </Button>
          <Button type="button" className="flex-1" onClick={onConfirmar}>
            Confirmar correção
          </Button>
        </div>
      </div>
    </div>
  );
}
