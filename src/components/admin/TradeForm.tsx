"use client";

import { useMemo, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Label, Select } from "@/components/ui/Input";
import { calcularResultadoTrade } from "@/lib/calculo-trade";
import { cn, formatarComSinal, formatarMoeda, formatarPercentual } from "@/lib/utils";
import { ModalConfirmacaoTrade } from "./ModalConfirmacaoTrade";
import { criarTrade } from "@/app/admin/(painel)/trades/novo/actions";

interface AtivoOption {
  nome: string;
  valorPorPonto: number;
}

export function TradeForm({
  ativos,
  capitalReferencia,
}: {
  ativos: AtivoOption[];
  capitalReferencia: number;
}) {
  const hoje = new Date().toISOString().slice(0, 10);

  const [data, setData] = useState(hoje);
  const [ativo, setAtivo] = useState(ativos[0]?.nome ?? "");
  const [lado, setLado] = useState<"COMPRA" | "VENDA">("COMPRA");
  const [precoEntrada, setPrecoEntrada] = useState("");
  const [precoSaida, setPrecoSaida] = useState("");
  const [contratos, setContratos] = useState("1");
  const [publicado, setPublicado] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const confirmadoRef = useRef(false);

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
        action={criarTrade}
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
            placeholder="Contexto da operação..."
            className="w-full rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-muted">
          <input
            type="checkbox"
            checked={publicado}
            onChange={(e) => setPublicado(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-accent"
          />
          Publicar imediatamente na página pública
        </label>
        <input type="hidden" name="publicado" value={publicado ? "true" : "false"} />

        {resultado && (
          <div className="rounded-lg border border-border bg-elevated px-4 py-3 text-sm text-muted">
            Prévia:{" "}
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

        <Button type="submit" size="lg" disabled={!resultado}>
          Lançar trade
        </Button>
      </form>

      {modalAberto && resultado && (
        <ModalConfirmacaoTrade
          resumo={{ data, ativo, lado, precoEntrada, precoSaida, contratos, publicado }}
          resultado={resultado}
          onConfirmar={handleConfirmar}
          onEditar={() => setModalAberto(false)}
        />
      )}
    </>
  );
}
