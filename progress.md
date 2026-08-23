# Copy Nômade Trader - Progresso

## Última atualização: 22/08/2026 (noite)

## 📌 Visão Geral
- Objetivo: plataforma standalone pro Matheus divulgar/vender copytrade via histórico de resultados
- Stack: Next.js 14 + TypeScript + Prisma + Neon + Tailwind + NextAuth v5 (magic link/Resend)
- Status: **NO AR EM PRODUÇÃO** — https://copy-nomade-trader.vercel.app — todas as 3 áreas do roteiro original prontas e testadas em produção de verdade
- Repo: https://github.com/Marcelo210598/copy-nomade-trader
- Banco de teste sempre fica limpo entre sessões (Marcelo pediu pra sempre apagar dados de teste gerados)

## 🚀 Deploy em produção (22/08/2026)
- Projeto conectado na Vercel pelo Marcelo, deploy automático a cada push na main
- **Bugs achados só em produção (build/runtime), corrigidos no mesmo dia** — ver seção de problemas abaixo
- 7 env vars configuradas na Vercel: `DATABASE_URL`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`, `AUTH_SECRET`, `AUTH_URL`, `RESEND_API_KEY`, `EMAIL_FROM`
- **Senha do admin em produção é DIFERENTE da de dev** (`admin123` só existe no `.env` local) — gerada uma senha forte só pra produção, o Marcelo tem o valor
- Testado ao vivo: home pública carregando dados reais do Neon, login do painel interno funcionando, dashboard carregando (empty state, banco limpo)

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

- **Área do investidor (magic link + saldo):**
  - NextAuth v5 + `@auth/prisma-adapter` + provider Resend (sem senha)
  - Model `Investidor` renomeado pra `User` no schema (exigência do adapter — nomes fixos `User`/`userId`), mapeado pra tabela física `investidores` via `@@map`
  - Sessão em JWT (não "database") — necessário pro middleware (Edge runtime não fala com Prisma)
  - `src/middleware.ts` agora protege `/admin/*` e `/investidor/*` no mesmo arquivo
  - Onboarding no primeiro acesso (capital inicial + data de entrada) antes de mostrar o saldo
  - `src/lib/saldo-investidor.ts`: composto (reaplica % sobre saldo acumulado) vs linear (% sempre sobre capital inicial), toggle + gráfico com as duas curvas
  - Testado: login redireciona certo, e-mail de magic link enviado (Resend), Marcelo clicou no link, onboarding e tela de saldo (composto/linear + gráfico) confirmados rodando certinho com print dele
  - **Bug achado e corrigido no teste real:** faltava `emailVerified` (+ `name`/`image`) no model `User` — o `@auth/prisma-adapter` exige esses campos e sem eles o primeiro login quebrava com `PrismaClientValidationError`. Só apareceu no clique real do link, não em nenhum teste anterior — migration `20260823000646_adiciona_campos_padrao_nextauth` já aplicada

- **Página pública com dados reais:**
  - `src/lib/estatisticas-publicas.ts` substitui o mock: agrega trades publicados (win rate, retorno acumulado, melhor trade, curva de capital) e soma o saldo atual (composto) de cada investidor com onboarding completo pro card de capital sob acompanhamento
  - Empty states tratados (zero trades publicados, melhor trade null)
  - Testado com 3 trades sintéticos: win rate 66,7%, retorno +1,20%, curva e ordem da lista batendo — apagado depois

- **Bugs de deploy (só apareceram em build/runtime de produção):**
  - `package.json` não gerava o Prisma Client no build (`prisma generate`) — quebraria em qualquer ambiente limpo, incluindo Vercel
  - Middleware (Edge runtime) importava o Prisma Client inteiro de forma indireta via `auth.ts` — separado em `auth.config.ts` (leve, sem adapter, usado no middleware) e `auth.ts` (completo, só em Node runtime)
  - `/admin/configuracoes`, `/admin/trades/novo`, `/admin` (dashboard) e `/investidor` foram geradas como páginas **estáticas** em pelo menos um build — dados do Prisma ficariam "congelados" do momento do build. Corrigido com `export const dynamic = "force-dynamic"` explícito em todas
  - `prisma.config.ts` fazia `import "dotenv/config"` sem ter `dotenv` como dependência declarada — funcionava local por acaso (hoisting), quebrava o `npm install` inteiro na Vercel (`Failed to load config file`). Removido — schema já declara `DATABASE_URL` via `env()` diretamente
  - Erro de lint (aspas não escapadas) quebrando `next build`
  - Após configurar as env vars na Vercel, `DATABASE_URL` resolveu vazia no primeiro deploy — Prisma reclamou de "empty string". Todas as 7 variáveis foram reconfiguradas com certeza (algumas o Marcelo já tinha preenchido, outras não)

## 🚧 TODO conhecido (não bloqueante agora)
- Upload de print removido do formulário por pedido do Marcelo (`printUrl` continua no schema, reativar quando fizer sentido — decidir storage: Vercel Blob, já que filesystem local não funciona no Vercel)
- **`EMAIL_FROM` no domínio de teste da Resend é mais grave do que "só entrega pro dono da conta"**: o magic link do Marcelo em produção foi enviado e "Delivered" (confirmado no painel Resend), mas não apareceu na caixa de entrada — a Resend sinaliza "Needs attention: Ensure link URLs match sending domain" (remetente `onboarding@resend.dev` vs link `copy-nomade-trader.vercel.app`), padrão clássico de phishing que o Gmail tende a jogar pro spam mesmo com entrega confirmada no servidor. **Bloqueia a área do investidor até ter domínio próprio verificado** — checar a pasta de spam por enquanto
- Neon no plano free hiberna por inatividade (autosuspend) — primeira requisição depois de um tempo parado pode dar erro de conexão; a segunda tentativa sempre funciona (banco "acorda"). Normal, não é bug.

## 📋 Próximos passos
- Todos os marcos do roteiro original (layout, painel interno, página pública, área do investidor) estão prontos, testados e **no ar em produção**. Falta alinhar com o Marcelo o que vem depois — candidatos: cadastro/gestão de investidores pelo admin, domínio de e-mail próprio, reativar upload de print, domínio customizado (não `.vercel.app`).

## 🔧 Configurações importantes
- `DATABASE_URL` (Neon) — configurada local (`.env`) e em produção (Vercel), mesmo banco pros dois por enquanto
- `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` — painel interno. **Senha de produção é diferente da de dev** (`admin123` só existe local)
- `AUTH_SECRET` / `AUTH_URL` / `RESEND_API_KEY` / `EMAIL_FROM` — magic link do investidor. `AUTH_URL` em produção = `https://copy-nomade-trader.vercel.app`

## 📚 Dependências principais
- next@14.2.x, prisma@6, @prisma/client@6, next-auth@5.0.0-beta, @auth/prisma-adapter, resend, zod, date-fns, recharts
