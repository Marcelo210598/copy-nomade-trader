"use client";

import { Button } from "@/components/ui/Button";
import { StatNumber } from "@/components/ui/StatNumber";
import { formatarComSinal, formatarMoeda, formatarPercentual } from "@/lib/utils";
import type { ResultadoCalculoTrade } from "@/lib/calculo-trade";

interface ResumoTrade {
  data: string;
  ativo: string;
  lado: "COMPRA" | "VENDA";
  precoEntrada: string;
  precoSaida: string;
  contratos: string;
  publicado: boolean;
}

export function ModalConfirmacaoTrade({
  resumo,
  resultado,
  onConfirmar,
  onEditar,
}: {
  resumo: ResumoTrade;
  resultado: ResultadoCalculoTrade;
  onConfirmar: () => void;
  onEditar: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
      onClick={onEditar}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-glow"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-medium uppercase tracking-wider text-muted">
          Confirme antes de publicar
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
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
          <Item
            label="Data"
            value={new Date(`${resumo.data}T00:00:00`).toLocaleDateString("pt-BR")}
          />
          <Item label="Ativo" value={resumo.ativo} />
          <Item label="Lado" value={resumo.lado === "COMPRA" ? "Compra" : "Venda"} />
          <Item label="Contratos" value={resumo.contratos} />
          <Item label="Entrada" value={resumo.precoEntrada} />
          <Item label="Saída" value={resumo.precoSaida} />
        </dl>

        <p className="mt-4 text-xs text-muted">
          {resumo.publicado
            ? "Vai aparecer imediatamente na página pública."
            : "Vai ser salvo como rascunho (não publicado)."}
        </p>

        <div className="mt-6 flex gap-3">
          <Button type="button" variant="secondary" className="flex-1" onClick={onEditar}>
            Editar
          </Button>
          <Button type="button" className="flex-1" onClick={onConfirmar}>
            {resumo.publicado ? "Confirmar e publicar" : "Confirmar e salvar"}
          </Button>
        </div>
      </div>
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
