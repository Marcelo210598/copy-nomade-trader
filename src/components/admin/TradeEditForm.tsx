"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { calcularResultadoTrade } from "@/lib/calculo-trade";
import { cn, formatarComSinal, formatarMoeda, formatarPercentual } from "@/lib/utils";
import { ModalConfirmacaoEdicao } from "./ModalConfirmacaoEdicao";
import { editarTrade } from "@/app/admin/(painel)/trades/[id]/actions";

interface AtivoOption {
  nome: string;
  valorPorPonto: number;
}

interface TradeInicial {
  id: string;
  data: string; // ISO yyyy-MM-dd
  ativo: string;
  lado: "COMPRA" | "VENDA";
  precoEntrada: number;
  precoSaida: number;
  contratos: number;
  observacao: string;
}

export function TradeEditForm({
  trade,
  ativos,
  capitalReferencia,
}: {
  trade: TradeInicial;
  ativos: AtivoOption[];
  capitalReferencia: number;
}) {
  const [data, setData] = useState(trade.data);
  const [ativo, setAtivo] = useState(trade.ativo);
  const [lado, setLado] = useState<"COMPRA" | "VENDA">(trade.lado);
  const [precoEntrada, setPrecoEntrada] = useState(String(trade.precoEntrada));
  const [precoSaida, setPrecoSaida] = useState(String(trade.precoSaida));
  const [contratos, setContratos] = useState(String(trade.contratos));
  const [observacao, setObservacao] = useState(trade.observacao);
  const [motivo, setMotivo] = useState("");
  const [modalAberto, setModalAberto] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const confirmadoRef = useRef(false);
  const acaoComId = editarTrade.bind(null, trade.id);

  const valorPorPonto = ativos.find((a) => a.nome === ativo)?.valorPorPonto ?? 0;

  const resultado = useMemo(() => {
    const entrada = Number(precoEntrada);
    const saida = Number(precoSaida);
    const qtd = Number(contratos);
    if (!entrada || !saida || !qtd) return null;
    return calcularResultadoTrade({
      lado,
      precoEntrada: entrada,
      precoSaida: saida,
      contratos: qtd,
      valorPorPonto,
      capitalReferencia,
    });
  }, [precoEntrada, precoSaida, contratos, lado, valorPorPonto, capitalReferencia]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    if (!confirmadoRef.current) {
      e.preventDefault();
      if (motivo.trim().length < 3) return; // required no campo já cobre isso na UI
      setModalAberto(true);
    }
  }

  function handleConfirmar() {
    confirmadoRef.current = true;
    setModalAberto(false);
    formRef.current?.requestSubmit();
  }

  return (
    <>
      <form
        ref={formRef}
        action={acaoComId}
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="data">Data</Label>
            <Input
              id="data"
              name="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="ativo">Ativo</Label>
            <Select
              id="ativo"
              name="ativo"
              value={ativo}
              onChange={(e) => setAtivo(e.target.value)}
              required
            >
              {ativos.map((a) => (
                <option key={a.nome} value={a.nome}>
                  {a.nome}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div>
          <Label>Lado</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setLado("COMPRA")}
              className={cn(
                "h-10 rounded-lg border text-sm font-medium transition-colors",
                lado === "COMPRA"
                  ? "border-profit/40 bg-profit/10 text-profit"
                  : "border-border bg-elevated text-muted hover:text-foreground"
              )}
            >
              Compra
            </button>
            <button
              type="button"
              onClick={() => setLado("VENDA")}
              className={cn(
                "h-10 rounded-lg border text-sm font-medium transition-colors",
                lado === "VENDA"
                  ? "border-loss/40 bg-loss/10 text-loss"
                  : "border-border bg-elevated text-muted hover:text-foreground"
              )}
            >
              Venda
            </button>
          </div>
          <input type="hidden" name="lado" value={lado} />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="precoEntrada">Preço entrada</Label>
            <Input
              id="precoEntrada"
              name="precoEntrada"
              type="number"
              step="0.01"
              value={precoEntrada}
              onChange={(e) => setPrecoEntrada(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="precoSaida">Preço saída</Label>
            <Input
              id="precoSaida"
              name="precoSaida"
              type="number"
              step="0.01"
              value={precoSaida}
              onChange={(e) => setPrecoSaida(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="contratos">Contratos</Label>
            <Input
              id="contratos"
              name="contratos"
              type="number"
              step="1"
              min="1"
              value={contratos}
              onChange={(e) => setContratos(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="observacao">Observação (opcional)</Label>
          <textarea
            id="observacao"
            name="observacao"
            rows={3}
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Contexto da operação..."
            className="w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <Label htmlFor="motivo">Motivo da correção (obrigatório)</Label>
          <textarea
            id="motivo"
            name="motivo"
            rows={2}
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Ex: preço de saída lançado errado, corrigido conforme corretora"
            required
            minLength={3}
            className="w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
          />
          <p className="mt-1 text-xs text-muted">
            Fica registrado no histórico junto com o valor anterior — nunca é sobrescrito.
          </p>
        </div>

        {resultado && (
          <div className="rounded-lg border border-border bg-elevated px-4 py-3 text-sm text-muted">
            Novo resultado:{" "}
            <span className="font-tabular text-foreground">
              {formatarComSinal(resultado.resultadoPontos)} pts
            </span>
            {" · "}
            <span className="font-tabular text-foreground">
              {formatarMoeda(resultado.resultadoDolar)}
            </span>
            {" · "}
            <span
              className={cn(
                "font-tabular font-semibold",
                resultado.retornoPercentual >= 0 ? "text-profit" : "text-loss"
              )}
            >
              {formatarPercentual(resultado.retornoPercentual)}
            </span>
          </div>
        )}

        <Button type="submit" size="lg" disabled={!resultado || motivo.trim().length < 3}>
          Salvar correção
        </Button>
      </form>

      {modalAberto && resultado && (
        <ModalConfirmacaoEdicao
          motivo={motivo}
          resultado={resultado}
          onConfirmar={handleConfirmar}
          onCancelar={() => setModalAberto(false)}
        />
      )}
    </>
  );
}
