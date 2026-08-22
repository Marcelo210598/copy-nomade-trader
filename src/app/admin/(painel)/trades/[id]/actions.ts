"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calcularResultadoTrade } from "@/lib/calculo-trade";

const tradeEditSchema = z.object({
  data: z.string().min(1, "Data obrigatória"),
  ativo: z.string().min(1, "Ativo obrigatório"),
  lado: z.enum(["COMPRA", "VENDA"]),
  precoEntrada: z.coerce.number(),
  precoSaida: z.coerce.number(),
  contratos: z.coerce.number().int().positive(),
  observacao: z.string().trim().optional(),
  motivo: z.string().trim().min(3, "Descreve o motivo da correção"),
});

const CAMPOS_COMPARAVEIS = [
  "data",
  "ativo",
  "lado",
  "precoEntrada",
  "precoSaida",
  "contratos",
  "observacao",
] as const;

function detectarCamposAlterados(
  anterior: Record<string, unknown>,
  novo: Record<string, unknown>
): string {
  const alterados = CAMPOS_COMPARAVEIS.filter(
    (campo) => String(anterior[campo] ?? "") !== String(novo[campo] ?? "")
  );
  return alterados.length > 0 ? alterados.join(", ") : "nenhum campo (só motivo registrado)";
}

export async function editarTrade(tradeId: string, formData: FormData) {
  const dados = tradeEditSchema.parse({
    data: formData.get("data"),
    ativo: formData.get("ativo"),
    lado: formData.get("lado"),
    precoEntrada: formData.get("precoEntrada"),
    precoSaida: formData.get("precoSaida"),
    contratos: formData.get("contratos"),
    observacao: formData.get("observacao") || undefined,
    motivo: formData.get("motivo"),
  });

  const [tradeAtual, configAtivo, configGeral] = await Promise.all([
    prisma.trade.findUniqueOrThrow({ where: { id: tradeId } }),
    prisma.configAtivo.findUniqueOrThrow({ where: { nome: dados.ativo } }),
    prisma.configGeral.findUniqueOrThrow({ where: { id: "config" } }),
  ]);

  const novoResultado = calcularResultadoTrade({
    lado: dados.lado,
    precoEntrada: dados.precoEntrada,
    precoSaida: dados.precoSaida,
    contratos: dados.contratos,
    valorPorPonto: configAtivo.valorPorPonto,
    capitalReferencia: configGeral.capitalReferencia,
  });

  const novaData = new Date(`${dados.data}T00:00:00`);

  const valorAnterior = {
    data: tradeAtual.data.toISOString().slice(0, 10),
    ativo: tradeAtual.ativo,
    lado: tradeAtual.lado,
    precoEntrada: tradeAtual.precoEntrada,
    precoSaida: tradeAtual.precoSaida,
    contratos: tradeAtual.contratos,
    observacao: tradeAtual.observacao,
    resultadoPontos: tradeAtual.resultadoPontos,
    resultadoDolar: tradeAtual.resultadoDolar,
    retornoPercentual: tradeAtual.retornoPercentual,
  };

  const valorNovo = {
    data: dados.data,
    ativo: dados.ativo,
    lado: dados.lado,
    precoEntrada: dados.precoEntrada,
    precoSaida: dados.precoSaida,
    contratos: dados.contratos,
    observacao: dados.observacao || null,
    resultadoPontos: novoResultado.resultadoPontos,
    resultadoDolar: novoResultado.resultadoDolar,
    retornoPercentual: novoResultado.retornoPercentual,
  };

  const campoAlterado = detectarCamposAlterados(valorAnterior, valorNovo);

  // nunca sobrescreve silenciosamente: grava o log antes de atualizar o trade, na mesma transação
  await prisma.$transaction([
    prisma.tradeEdicao.create({
      data: {
        tradeId,
        campoAlterado,
        valorAnterior,
        valorNovo,
        motivo: dados.motivo,
      },
    }),
    prisma.trade.update({
      where: { id: tradeId },
      data: {
        data: novaData,
        ativo: dados.ativo,
        lado: dados.lado,
        precoEntrada: dados.precoEntrada,
        precoSaida: dados.precoSaida,
        contratos: dados.contratos,
        observacao: dados.observacao || null,
        resultadoPontos: novoResultado.resultadoPontos,
        resultadoDolar: novoResultado.resultadoDolar,
        retornoPercentual: novoResultado.retornoPercentual,
        editadoEm: new Date(),
      },
    }),
  ]);

  // saldo dos investidores é sempre derivado on-the-fly a partir dos trades publicados
  // (não persistido) — a edição já reflete automaticamente assim que a área do investidor ler os trades.
  revalidatePath("/admin/trades");
  revalidatePath(`/admin/trades/${tradeId}`);
  revalidatePath("/admin");
  revalidatePath("/");
  redirect(`/admin/trades/${tradeId}?editado=1`);
}
