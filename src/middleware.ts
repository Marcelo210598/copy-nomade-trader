import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { ADMIN_COOKIE_NAME, validarTokenSessao } from "@/lib/admin-auth";

// Instância própria do NextAuth só com a config leve (sem Prisma adapter) —
// o middleware roda em Edge runtime e só precisa decodificar o JWT do cookie.
const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const sessaoValida = await validarTokenSessao(token);

    if (!sessaoValida) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  const rotaInvestidorPublica =
    pathname === "/investidor/login" || pathname === "/investidor/verifique-email";

  if (pathname.startsWith("/investidor") && !rotaInvestidorPublica) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/investidor/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/investidor/:path*"],
};
