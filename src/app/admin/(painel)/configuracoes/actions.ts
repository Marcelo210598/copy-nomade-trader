"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const ativoSchema = z.object({
  nome: z.string().trim().min(1, "Nome obrigatório").max(10).toUpperCase(),
  valorPorPonto: z.coerce.number().positive("Precisa ser maior que zero"),
});

export async function criarAtivo(formData: FormData) {
  const dados = ativoSchema.parse({
    nome: formData.get("nome"),
    valorPorPonto: formData.get("valorPorPonto"),
  });

  await prisma.configAtivo.upsert({
    where: { nome: dados.nome },
    update: { valorPorPonto: dados.valorPorPonto, ativo: true },
    create: dados,
  });

  revalidatePath("/admin/configuracoes");
}

export async function alternarAtivo(id: string) {
  const ativo = await prisma.configAtivo.findUniqueOrThrow({ where: { id } });
  await prisma.configAtivo.update({
    where: { id },
    data: { ativo: !ativo.ativo },
  });
  revalidatePath("/admin/configuracoes");
}

const configGeralSchema = z.object({
  capitalReferencia: z.coerce.number().positive("Precisa ser maior que zero"),
  metaMensalPercentual: z.coerce.number().min(0),
});

export async function salvarConfigGeral(formData: FormData) {
  const dados = configGeralSchema.parse({
    capitalReferencia: formData.get("capitalReferencia"),
    metaMensalPercentual: formData.get("metaMensalPercentual"),
  });

  await prisma.configGeral.upsert({
    where: { id: "config" },
    update: dados,
    create: { id: "config", ...dados, thresholdsSaude: {} },
  });

  revalidatePath("/admin/configuracoes");
  revalidatePath("/admin/trades/novo");
}
