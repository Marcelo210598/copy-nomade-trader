"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatNumber } from "@/components/ui/StatNumber";
import { EvolucaoSaldoChart } from "./EvolucaoSaldoChart";
import { cn, formatarMoeda, formatarPercentual } from "@/lib/utils";
import type { ResultadoSaldo } from "@/lib/saldo-investidor";

type Modo = "composto" | "linear";

export function SaldoComparativo({ resultado }: { resultado: ResultadoSaldo }) {
  const [modo, setModo] = useState<Modo>("composto");

  const saldoDestaque = modo === "composto" ? resultado.saldoAtualComposto : resultado.saldoAtualLinear;
  const retornoDestaque = modo === "composto" ? resultado.retornoComposto : resultado.retornoLinear;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">Saldo atual</p>
          <div className="flex gap-1 rounded-lg border border-border bg-elevated p-1">
            <button
              type="button"
              onClick={() => setModo("composto")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                modo === "composto"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted hover:text-foreground"
              )}
            >
              Composto
            </button>
            <button
              type="button"
              onClick={() => setModo("linear")}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                modo === "linear"
                  ? "bg-accent text-accent-foreground"
                  : "text-muted hover:text-foreground"
              )}
            >
              Linear
            </button>
          </div>
        </div>

        <div className="mt-2 flex items-baseline gap-3">
          <StatNumber value={formatarMoeda(saldoDestaque)} tone="accent" size="xl" />
          <span
            className={cn(
              "font-tabular text-sm font-medium",
              retornoDestaque >= 0 ? "text-profit" : "text-loss"
            )}
          >
            {formatarPercentual(retornoDestaque)}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">
          {modo === "composto"
            ? "Cada trade reaplica o % sobre o saldo acumulado"
            : "Cada trade aplica o % sempre sobre o capital inicial"}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Composto</CardTitle>
          </CardHeader>
          <StatNumber value={formatarMoeda(resultado.saldoAtualComposto)} size="md" />
          <p className="mt-1 font-tabular text-xs text-muted">
            {formatarPercentual(resultado.retornoComposto)}
          </p>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Linear</CardTitle>
          </CardHeader>
          <StatNumber value={formatarMoeda(resultado.saldoAtualLinear)} size="md" />
          <p className="mt-1 font-tabular text-xs text-muted">
            {formatarPercentual(resultado.retornoLinear)}
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evolução do saldo</CardTitle>
        </CardHeader>
        <EvolucaoSaldoChart dados={resultado.evolucao} />
      </Card>
    </div>
  );
}
