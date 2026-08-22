"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, SESSION_MAX_AGE, criarTokenSessao, validarSenhaAdmin } from "@/lib/admin-auth";

export async function loginAdmin(formData: FormData) {
  const senha = String(formData.get("senha") ?? "");

  if (!senha || !validarSenhaAdmin(senha)) {
    redirect("/admin/login?erro=1");
  }

  const token = await criarTokenSessao();
  cookies().set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect("/admin");
}
