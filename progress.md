# Copy Nômade Trader - Progresso

## Última atualização: 22/08/2026

## 📌 Visão Geral
- Objetivo: plataforma standalone pro Matheus divulgar/vender copytrade via histórico de resultados
- Stack: Next.js 14 + TypeScript + Prisma + Neon + Tailwind + NextAuth v5 (magic link/Resend)
- Status: **design system aprovado e aplicado**, página pública (vitrine) rodando em localhost com dados mock

## ✅ Concluído
- Projeto Next.js 14 (App Router, TS, Tailwind, src/dir) criado
- Dependências instaladas: prisma, @prisma/client, next-auth@beta, @auth/prisma-adapter, resend, zod, date-fns, recharts, clsx, tailwind-merge
- Schema Prisma completo: Trade, TradeEdicao (log de correções), ConfigAtivo, ConfigGeral, Investidor + tabelas NextAuth (Account, Session, VerificationToken)
- `.env.example` e `.env` (dev) com todas as variáveis necessárias
- `.gitignore` ajustado (`.env` explicitamente ignorado)
- Pesquisa de referências de design (Bloomberg terminal, dark fintech dashboards 2026) — direção aprovada: fundo petróleo escuro + acento âmbar + Space Grotesk (display) + JetBrains Mono (números)
- Design system em código: tokens de cor (`globals.css`), Tailwind config, componentes base (`Button`, `Card`, `Badge`, `Input`/`Select`, `StatNumber`)
- Página pública (`/`) montada com dados mock: hero, capital sob acompanhamento, KPIs, curva de capital (recharts), lista de trades — conferida visualmente no Chrome, rodando em `localhost:3000`

## 🚧 Em progresso
- Painel interno (`/admin`): login por senha + formulário de lançamento de trade + modal de confirmação

## ⚠️ Problemas encontrados
- npm cache com arquivos root-owned (bug antigo) → contornado usando cache alternativo no scratchpad, sem precisar de `sudo chown`
- `create-next-app`/`prisma init` instalaram Prisma 7 por padrão (breaking changes: client output customizado, sem `datasource env()` no schema) → fixado em Prisma 6 (estável, compatível com `@auth/prisma-adapter`)
- Badge de "Compra/Venda" no card de trade estava usando verde/vermelho (confundia com lucro/prejuízo) → corrigido pra neutro; cor de resultado fica só no %/pontos

## 📋 Próximos passos
1. Painel interno: login por senha (cookie assinado via `ADMIN_SESSION_SECRET`)
2. Formulário de lançamento de trade + modal de confirmação (resumo + % em destaque)
3. Toggle "publicado" + edição com log de correção (recalculando saldo dos investidores afetados)
4. Dashboard interno (períodos fechados, semáforo de saúde, meta mensal)
5. Trocar dados mock da página pública por queries reais do Prisma
6. Área do investidor (onboarding, magic link via Resend, saldo composto vs linear)
7. Migração inicial do banco (precisa da `DATABASE_URL` real do Neon — pendente)

## 🔧 Configurações importantes
- `DATABASE_URL` (Neon) — ainda não configurada, usando placeholder
- `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` — painel interno
- `AUTH_SECRET` / `RESEND_API_KEY` / `EMAIL_FROM` — magic link do investidor

## 📚 Dependências principais
- next@14.2.x, prisma@6, @prisma/client@6, next-auth@5.0.0-beta, @auth/prisma-adapter, resend, zod, date-fns, recharts
