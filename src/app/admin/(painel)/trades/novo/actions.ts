"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { calcularResultadoTrade } from "@/lib/calculo-trade";

const tradeSchema = z.object({
  data: z.string().min(1, "Data obrigatória"),
  ativo: z.string().min(1, "Ativo obrigatório"),
  lado: z.enum(["COMPRA", "VENDA"]),
  precoEntrada: z.coerce.number(),
  precoSaida: z.coerce.number(),
  contratos: z.coerce.number().int().positive(),
  observacao: z.string().trim().optional(),
  publicado: z.string().optional(),
});

export async function criarTrade(formData: FormData) {
  const dados = tradeSchema.parse({
    data: formData.get("data"),
    ativo: formData.get("ativo"),
    lado: formData.get("lado"),
    precoEntrada: formData.get("precoEntrada"),
    precoSaida: formData.get("precoSaida"),
    contratos: formData.get("contratos"),
    observacao: formData.get("observacao") || undefined,
    publicado: formData.get("publicado") || undefined,
  });

  const [configAtivo, configGeral] = await Promise.all([
    prisma.configAtivo.findUniqueOrThrow({ where: { nome: dados.ativo } }),
    prisma.configGeral.findUniqueOrThrow({ where: { id: "config" } }),
  ]);

  // recalcula no servidor — nunca confia no valor mostrado no cliente
  const { resultadoPontos, resultadoDolar, retornoPercentual } = calcularResultadoTrade({
    lado: dados.lado,
    precoEntrada: dados.precoEntrada,
    precoSaida: dados.precoSaida,
    contratos: dados.contratos,
    valorPorPonto: configAtivo.valorPorPonto,
    capitalReferencia: configGeral.capitalReferencia,
  });

  let printUrl: string | null = null;
  const printFile = formData.get("print");
  if (printFile instanceof File && printFile.size > 0) {
    printUrl = await salvarPrint(printFile);
  }

  await prisma.trade.create({
    data: {
      data: new Date(`${dados.data}T00:00:00`),
      ativo: dados.ativo,
      lado: dados.lado,
      precoEntrada: dados.precoEntrada,
      precoSaida: dados.precoSaida,
      contratos: dados.contratos,
      resultadoPontos,
      resultadoDolar,
      retornoPercentual,
      observacao: dados.observacao || null,
      printUrl,
      publicado: dados.publicado === "true",
    },
  });

  revalidatePath("/admin/trades");
  revalidatePath("/");
  redirect("/admin/trades?criado=1");
}

// Salva localmente em /public/uploads — funciona em localhost.
// TODO: trocar por Vercel Blob antes do deploy (filesystem do Vercel é read-only).
async function salvarPrint(file: File): Promise<string> {
  const bytes = Buffer.from(await file.arrayBuffer());
  const extensao = file.name.split(".").pop() || "png";
  const nomeArquivo = `${randomUUID()}.${extensao}`;
  const pasta = path.join(process.cwd(), "public", "uploads", "trades");
  await mkdir(pasta, { recursive: true });
  await writeFile(path.join(pasta, nomeArquivo), bytes);
  return `/uploads/trades/${nomeArquivo}`;
}
