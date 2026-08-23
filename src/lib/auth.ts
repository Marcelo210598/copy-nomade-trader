import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

// DEBUG temporário — investigando magic link que não chega. Loga só
// tamanho/prefixo, nunca o valor completo. Remover depois de resolvido.
console.log("[debug-resend]", {
  apiKeyLength: process.env.RESEND_API_KEY?.length ?? 0,
  apiKeyPrefix: process.env.RESEND_API_KEY?.slice(0, 6) ?? "(vazio)",
  emailFrom: process.env.EMAIL_FROM ?? "(vazio)",
});

// Config completa (Node runtime — rotas, server actions). Usa o Prisma
// adapter, por isso não pode ser importada pelo middleware (veja auth.config.ts).
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    }),
  ],
});
