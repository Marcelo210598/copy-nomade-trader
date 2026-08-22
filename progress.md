# Copy Nômade Trader - Progresso

## Última atualização: 22/08/2026

## 📌 Visão Geral
- Objetivo: plataforma standalone pro Matheus divulgar/vender copytrade via histórico de resultados
- Stack: Next.js 14 + TypeScript + Prisma + Neon + Tailwind + NextAuth v5 (magic link/Resend)
- Status: **painel interno funcional** (login, configurações, lançamento de trade com modal) testado de ponta a ponta contra o Neon real e publicado no GitHub
- Repo: https://github.com/Marcelo210598/copy-nomade-trader

## ✅ Concluído
- Projeto Next.js 14 (App Router, TS, Tailwind, src/dir) criado
- Dependências instaladas: prisma, @prisma/client, next-auth@beta, @auth/prisma-adapter, resend, zod, date-fns, recharts, clsx, tailwind-merge
- Schema Prisma completo: Trade, TradeEdicao (log de correções), ConfigAtivo, ConfigGeral, Investidor + tabelas NextAuth (Account, Session, VerificationToken)
- Design system: fundo petróleo escuro + acento âmbar, Space Grotesk (display) + JetBrains Mono (números), componentes base (`Button`, `Card`, `Badge`, `Input`/`Select`, `StatNumber`)
- Página pública (`/`) com dados mock: hero, capital sob acompanhamento, KPIs, curva de capital (recharts), lista de trades
- **Banco Neon real conectado** (`neondb`, região sa-east-1) — migration `20260822232630_init` aplicada
- **Painel interno (`/admin`) funcional e testado no navegador:**
  - Login por senha compartilhada (`ADMIN_PASSWORD`), cookie assinado HMAC-SHA256 (Web Crypto, compatível com middleware Edge)
  - Middleware protegendo todas as rotas `/admin/*`
  - Configurações: cadastro/desativação de ativos (nome + valor do ponto), capital de referência, meta mensal — tudo gravando no Neon
  - Formulário de lançamento de trade: cálculo automático (pontos → $ → %) recalculado no servidor (nunca confia no valor do cliente), upload opcional de print (salvo em `/public/uploads` — local only, ver TODO)
  - Modal de confirmação: resumo + % em destaque grande, "Confirmar e publicar/salvar" ou "Editar"
  - Lista de trades com toggle publicado/rascunho (testado nos dois sentidos)
  - Fluxo completo validado: login → cadastrar ativo NQ (R$20/pt) → capital R$50.000 → lançar trade 15000→15050 compra → prévia +50pts/R$1.000/+2% → modal → confirmado → salvo no Neon → toggle publicado funcionando
- Git inicializado, `.env` confirmado fora do commit, push feito pra `main` do repo

## ⚠️ Problemas encontrados
- npm cache com arquivos root-owned (bug antigo) → contornado usando cache alternativo no scratchpad, sem precisar de `sudo chown`
- `create-next-app`/`prisma init` instalaram Prisma 7 por padrão (breaking changes: client output customizado, sem `datasource env()` no schema) → fixado em Prisma 6 (estável, compatível com `@auth/prisma-adapter`)
- Badge de "Compra/Venda" no card de trade estava usando verde/vermelho (confundia com lucro/prejuízo) → corrigido pra neutro; cor de resultado fica só no %/pontos
- `npx prisma dev` (Postgres local) não funciona neste ambiente (sem Docker) → usamos o Neon real do Marcelo desde já

## 🚧 TODO conhecido (não bloqueante agora)
- Upload de print salva em `public/uploads` (filesystem local) — quebra no Vercel (read-only). Trocar por Vercel Blob antes do deploy.
- Trade de teste (NQ, 22/08, +2%) ficou no banco — Marcelo decide se apaga ou deixa

## 📋 Próximos passos
1. Edição de trade publicado com log de correção (recalculando saldo dos investidores afetados)
2. Dashboard interno completo: seletor de período (diário/semanal/mensal/semestral/anual), win rate, curva de capital do período, comparação com período anterior, meta mensal com barra de progresso, semáforo de saúde 🟢🟡🔴
3. Trocar dados mock da página pública por queries reais do Prisma
4. Área do investidor (onboarding, magic link via Resend, saldo composto vs linear)

## 🔧 Configurações importantes
- `DATABASE_URL` (Neon) — ainda não configurada, usando placeholder
- `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` — painel interno
- `AUTH_SECRET` / `RESEND_API_KEY` / `EMAIL_FROM` — magic link do investidor

## 📚 Dependências principais
- next@14.2.x, prisma@6, @prisma/client@6, next-auth@5.0.0-beta, @auth/prisma-adapter, resend, zod, date-fns, recharts
