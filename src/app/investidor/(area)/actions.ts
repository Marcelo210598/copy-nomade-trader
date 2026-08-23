"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function logoutInvestidor() {
  await signOut({ redirectTo: "/investidor/login" });
}

const onboardingSchema = z.object({
  capitalInicial: z.coerce.number().positive("Precisa ser maior que zero"),
  dataInicio: z.string().min(1, "Data obrigatória"),
});

export async function completarOnboarding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) redirect("/investidor/login");

  const dados = onboardingSchema.parse({
    capitalInicial: formData.get("capitalInicial"),
    dataInicio: formData.get("dataInicio"),
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      capitalInicial: dados.capitalInicial,
      dataInicio: new Date(`${dados.dataInicio}T00:00:00`),
    },
  });

  revalidatePath("/investidor");
  redirect("/investidor");
}
