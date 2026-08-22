// Sessão do painel interno: cookie assinado (HMAC-SHA256) via Web Crypto,
// pra funcionar tanto em route handlers/server actions (Node) quanto no
// middleware (Edge runtime) sem depender do módulo `crypto` do Node.

export const ADMIN_COOKIE_NAME = "admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 12; // 12h

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET não configurado no .env");
  }
  return secret;
}

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder().encode(getSecret());
  return crypto.subtle.importKey("raw", enc, { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function compararEmTempoConstante(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function criarTokenSessao(): Promise<string> {
  const expiraEm = Date.now() + SESSION_DURATION_SECONDS * 1000;
  const payload = String(expiraEm);
  const key = await getKey();
  const assinatura = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${toHex(assinatura)}`;
}

export async function validarTokenSessao(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, assinaturaRecebida] = token.split(".");
  if (!payload || !assinaturaRecebida) return false;

  const expiraEm = Number(payload);
  if (Number.isNaN(expiraEm) || Date.now() > expiraEm) return false;

  const key = await getKey();
  const assinaturaEsperada = toHex(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload))
  );

  return compararEmTempoConstante(assinaturaRecebida, assinaturaEsperada);
}

/** Compara a senha digitada com ADMIN_PASSWORD em tempo constante. */
export function validarSenhaAdmin(senhaDigitada: string): boolean {
  const senhaCorreta = process.env.ADMIN_PASSWORD;
  if (!senhaCorreta) {
    throw new Error("ADMIN_PASSWORD não configurado no .env");
  }
  return compararEmTempoConstante(senhaDigitada, senhaCorreta);
}

export const SESSION_MAX_AGE = SESSION_DURATION_SECONDS;
