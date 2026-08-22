"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { periodoAnterior, periodoSeguinte, TIPOS_PERIODO, type TipoPeriodo } from "@/lib/periodos";

export function SeletorPeriodo({
  tipo,
  dataReferencia,
  labelPeriodo,
}: {
  tipo: TipoPeriodo;
  dataReferencia: string; // ISO yyyy-MM-dd
  labelPeriodo: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function atualizarUrl(novoTipo: TipoPeriodo, novaData: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tipo", novoTipo);
    params.set("ref", novaData);
    router.push(`${pathname}?${params.toString()}`);
  }

  function trocarTipo(novoTipo: TipoPeriodo) {
    atualizarUrl(novoTipo, new Date().toISOString().slice(0, 10));
  }

  function navegar(direcao: "anterior" | "proximo") {
    const data = new Date(`${dataReferencia}T00:00:00`);
    const novaData =
      direcao === "anterior" ? periodoAnterior(tipo, data) : periodoSeguinte(tipo, data);
    atualizarUrl(tipo, novaData.toISOString().slice(0, 10));
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex w-fit gap-1 rounded-lg border border-border bg-elevated p-1">
        {TIPOS_PERIODO.map((opcao) => (
          <button
            key={opcao.valor}
            type="button"
            onClick={() => trocarTipo(opcao.valor)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              tipo === opcao.valor
                ? "bg-accent text-accent-foreground"
                : "text-muted hover:text-foreground"
            )}
          >
            {opcao.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navegar("anterior")}
          aria-label="Período anterior"
          className="rounded-md border border-border p-1.5 text-muted transition-colors hover:bg-elevated hover:text-foreground"
        >
          ‹
        </button>
        <span className="min-w-[180px] text-center font-tabular text-sm font-medium capitalize">
          {labelPeriodo}
        </span>
        <button
          type="button"
          onClick={() => navegar("proximo")}
          aria-label="Próximo período"
          className="rounded-md border border-border p-1.5 text-muted transition-colors hover:bg-elevated hover:text-foreground"
        >
          ›
        </button>
      </div>
    </div>
  );
}
