# Copy Nômade Trader - Progresso

## Última atualização: 22/08/2026

## 📌 Visão Geral
- Objetivo: plataforma standalone pro Matheus divulgar/vender copytrade via histórico de resultados
- Stack: Next.js 14 + TypeScript + Prisma + Neon + Tailwind + NextAuth v5 (magic link/Resend)
- Status: **painel interno completo** (login, configurações, lançamento de trade, dashboard com período/meta/semáforo) testado de ponta a ponta contra o Neon real e publicado no GitHub
- Repo: https://github.com/Marcelo210598/copy-nomade-trader
- Banco de teste sempre fica limpo entre sessões (Marcelo pediu pra sempre apagar dados de teste gerados)

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

- **Dashboard interno completo:**
  - `src/lib/periodos.ts`: cálculo de ranges fechados (diário/semanal seg-dom/mensal/semestral/anual) + navegação anterior/próximo + dias úteis restantes do mês
  - `src/lib/metricas-trade.ts`: win rate, resultado total, melhor/pior trade, curva de capital, expectância e drawdown (janela de 30 dias)
  - `src/lib/semaforo-saude.ts`: 🟢🟡🔴 configurável via thresholds em Configurações
  - `SeletorPeriodo` (tabs + navegação, sincronizado na URL via searchParams), `PainelStatus` (meta mensal + semáforo), `MetricasPeriodo` (cards + curva de capital)
  - Testado com dados sintéticos: soma de retornos, win rate, melhor/pior, comparação com período anterior e curva de capital todos bateram a conta manual — dados de teste apagados depois

## ⚠️ Problemas encontrados
- npm cache com arquivos root-owned (bug antigo) → contornado usando cache alternativo no scratchpad, sem precisar de `sudo chown`
- `create-next-app`/`prisma init` instalaram Prisma 7 por padrão (breaking changes: client output customizado, sem `datasource env()` no schema) → fixado em Prisma 6 (estável, compatível com `@auth/prisma-adapter`)
- Badge de "Compra/Venda" no card de trade estava usando verde/vermelho (confundia com lucro/prejuízo) → corrigido pra neutro; cor de resultado fica só no %/pontos
- Card "Melhor/Pior" do dashboard usava tone fixo (profit/loss) no `StatNumber` → "pior trade" aparecia vermelho mesmo quando positivo (só havia trades ganhadores no período) → corrigido pra `tone="auto"`
- `npx prisma dev` (Postgres local) não funciona neste ambiente (sem Docker) → usamos o Neon real do Marcelo desde já

## ⚠️ Fora do código (memória do Claude)
- Ao salvar a memória de projeto no fim desta sessão, sobrescrevi por engano outra memória já existente com o mesmo nome (era sobre a landing page antiga do Matheus em `Copytrade/landing`, projeto separado). Corrigido: renomeei o slug pra `project_copy_nomade_trader_plataforma` e reconstituí a memória antiga com o que achei no git — mas parte do conteúdo original dela pode ter se perdido.

- **Edição de trade com log de correção:**
  - `/admin/trades/[id]`: detalhe do trade (resultado atual + histórico de correções)
  - `/admin/trades/[id]/editar`: formulário pré-preenchido, motivo obrigatório, modal de confirmação mostrando o novo resultado antes de salvar
  - `TradeEdicao` grava snapshot antes/depois + motivo + campos alterados, na mesma transação do update — nunca sobrescreve silenciosamente
  - Saldo dos investidores é sempre derivado on-the-fly dos trades publicados (não persistido) → a correção já reflete automaticamente assim que a área do investidor existir, sem precisar de um passo extra de "recálculo"
  - Testado de ponta a ponta: criei um trade, editei o preço de saída, conferi o histórico com antes/depois batendo, apaguei os dados de teste depois

## 🚧 TODO conhecido (não bloqueante agora)
- Upload de print removido do formulário por pedido do Marcelo (`printUrl` continua no schema, reativar quando fizer sentido — decidir storage: Vercel Blob, já que filesystem local não funciona no Vercel)

## 📋 Próximos passos
1. Trocar dados mock da página pública por queries reais do Prisma
2. Área do investidor (onboarding, magic link via Resend, saldo composto vs linear)

## 🔧 Configurações importantes
- `DATABASE_URL` (Neon) — ainda não configurada, usando placeholder
- `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` — painel interno
- `AUTH_SECRET` / `RESEND_API_KEY` / `EMAIL_FROM` — magic link do investidor

## 📚 Dependências principais
- next@14.2.x, prisma@6, @prisma/client@6, next-auth@5.0.0-beta, @auth/prisma-adapter, resend, zod, date-fns, recharts
