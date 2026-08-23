import type { NextAuthConfig } from "next-auth";

/**
 * Config "leve" do NextAuth — sem adapter/Prisma, sem provider Resend.
 * Usada pelo middleware (Edge runtime, não pode importar Prisma nem
 * módulos que dependem de APIs Node como setImmediate/CompressionStream).
 * A config completa (src/lib/auth.ts) espalha isso e adiciona o resto.
 */
export const authConfig: NextAuthConfig = {
  providers: [],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/investidor/login",
    verifyRequest: "/investidor/verifique-email",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) session.user.id = token.id as string;
      return session;
    },
  },
};
