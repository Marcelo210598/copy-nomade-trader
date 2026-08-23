"use server";

import { signIn } from "@/lib/auth";

export async function loginInvestidor(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return;

  await signIn("resend", { email, redirectTo: "/investidor" });
}
