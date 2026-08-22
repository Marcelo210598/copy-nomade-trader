"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function alternarPublicado(id: string) {
  const trade = await prisma.trade.findUniqueOrThrow({ where: { id } });
  await prisma.trade.update({ where: { id }, data: { publicado: !trade.publicado } });
  revalidatePath("/admin/trades");
  revalidatePath("/");
}
