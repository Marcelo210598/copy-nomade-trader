# Copy Nômade Trader - Progresso

## Última atualização: 24/08/2026

## 📌 Visão Geral
- Objetivo: plataforma standalone pro Matheus divulgar/vender copytrade via histórico de resultados
- Stack: Next.js 14 + TypeScript + Prisma + Neon + Tailwind + NextAuth v5 (magic link/Resend)
- Status: **NO AR EM PRODUÇÃO** — https://copy-nomade-trader.vercel.app — todas as 3 áreas do roteiro original prontas e testadas em produção de verdade
- Repo: https://github.com/Marcelo210598/copy-nomade-trader
- Banco de teste sempre fica limpo entre sessões (Marcelo pediu pra sempre apagar dados de teste gerados)

## ✅ Concluído (projeto inteiro, do zero ao ar)
- Projeto Next.js 14 (App Router, TS, Tailwind, src/dir), Prisma 6 + Neon (`neondb`, sa-east-1)
- Design system: fundo petróleo escuro + acento âmbar, Space Grotesk (display) + JetBrains Mono (números), componentes base (`Button`, `Card`, `Badge`, `Input`/`Select`, `StatNumber`)
- **Painel interno (`/admin`)**: login por senha (cookie HMAC assinado), configurações (ativos, capital de referência, meta, thresholds do semáforo), formulário de lançamento com modal de confirmação, dashboard com período fechado (diário/semanal/mensal/semestral/anual) + meta mensal + semáforo 🟢🟡🔴, edição de trade com log de correção (nunca sobrescreve — guarda antes/depois + motivo)
- **Página pública (`/`)**: dados reais do Prisma — win rate, retorno acumulado, curva de capital, capital total sob acompanhamento (soma do saldo de cada investidor), lista de trades publicados
- **Área do investidor (`/investidor`)**: magic link via Resend (sem senha), onboarding (nome + capital inicial + data de entrada), saldo composto vs linear lado a lado com toggle + gráfico
- **Deploy em produção na Vercel**, deploy automático a cada push na `main`, 7 env vars configuradas

## 🆕 23/08/2026 — testes em produção + correção de regra de negócio
- Bateria de testes completa em produção: tudo ✅ (login admin, config, lançamento/edição de trade, dashboard, página pública, onboarding)
- **Bug corrigido**: trade lançado no sistema ANTES do investidor confirmar a entrada, mas do mesmo dia da `dataInicio` escolhida, contava indevidamente no saldo dele. Agora o model `User` tem `entradaConfirmadaEm DateTime?` (timestamp exato do onboarding) e `filtrarTradesDoInvestidor` (`src/lib/saldo-investidor.ts`) só desempata por horário (`trade.criadoEm` vs `entradaConfirmadaEm`) quando a confirmação foi no mesmo dia de `dataInicio` — entrada retroativa continua contando o dia inteiro. Aplicado em `/investidor` e em `estatisticas-publicas.ts`. Migration aplicada no Neon, build local testado, deploy feito.
- Domínio de e-mail próprio (bug #7 abaixo) **adiado sem prazo** — decisão do Marcelo em 23/08, vai demorar pra ter domínio disponível.

## 🐛 Bugs encontrados e corrigidos (todos no mesmo dia, 22/08 salvo indicação em contrário)
1. **Prisma 7 instalado por padrão** pelo `create-next-app`/`prisma init` (breaking changes) → fixado em Prisma 6, compatível com `@auth/prisma-adapter`
2. **Badge Compra/Venda** usava verde/vermelho e confundia com lucro/prejuízo → neutro; cor de resultado só no %/pontos
3. **Card Melhor/Pior do dashboard** com tone fixo → "pior trade" aparecia vermelho mesmo positivo → `tone="auto"`
4. **`emailVerified` faltando no model `User`** — o `@auth/prisma-adapter` exige esse campo (+ `name`/`image`); sem ele o primeiro login via magic link quebrava com `PrismaClientValidationError`. Só apareceu no clique real do link recebido por e-mail, nunca em teste local
5. **Build de produção quebrado (4 causas diferentes, achadas rodando `next build` de verdade antes do deploy):**
   - `package.json` não rodava `prisma generate` no build
   - Middleware (Edge runtime) importava o Prisma Client inteiro via `auth.ts` → separado em `auth.config.ts` (leve, sem adapter, pro middleware) e `auth.ts` (completo, só Node runtime)
   - Várias páginas do admin/investidor viraram **estáticas** num build (dados do Prisma ficariam congelados) → `export const dynamic = "force-dynamic"` explícito em todas
   - `prisma.config.ts` importava `dotenv` sem essa dependência declarada → quebrava o `npm install` inteiro na Vercel. Removido (dispensável)
   - Erro de lint (aspas não escapadas) quebrando `next build`
6. **`DATABASE_URL` vazia no primeiro deploy na Vercel** mesmo configurada — reconfiguradas as 7 env vars com certeza
7. **Magic link "Delivered" mas não aparecia na caixa de entrada do Marcelo** — investigado a fundo (chave Resend correta, chamada de API acontecendo, e-mail confirmado entregue no painel da Resend). Causa real: a própria Resend sinaliza "Needs attention: Ensure link URLs match sending domain" — remetente `onboarding@resend.dev` vs link `copy-nomade-trader.vercel.app`, padrão clássico de phishing que o Gmail tende a jogar pro spam mesmo com entrega confirmada no servidor. **Achado no spam.**

## 🆕 24/08/2026 — dólar no saldo + login de investidor quebrado corrigido
- **Saldo/valores trocados de R$ pra US$**: `formatarMoeda` em `src/lib/utils.ts` formatava como BRL um valor que já era dólar (`resultadoDolar`). Trocado `currency: "BRL"` → `"USD"` (mantendo locale `pt-BR` pro separador de milhar/decimal: `US$ 1.234,50`). Afeta saldo do investidor, painel admin e página pública — todos os lugares que usam `formatarMoeda`.
- **BUG CRÍTICO encontrado e corrigido**: login de investidor via magic link só funcionava pro próprio Marcelo. `EMAIL_FROM` usava o domínio de teste da Resend (`onboarding@resend.dev`), que **só entrega pro e-mail dono da conta Resend** — pra qualquer outro destinatário a API da Resend recusa com 403, e isso derrubava a tela de login do investidor com o erro genérico do NextAuth ("Server error / problem with the server configuration"). Achado quando o Luiz (investidor real) tentou logar e caiu nessa tela.
  - Fix: reaproveitado o domínio `meutrade.app`, já verificado na conta Resend (de outro projeto). `EMAIL_FROM` trocado pra `Copy Nomade Trader <login@meutrade.app>` — atualizado no `.env` local e nas envs Production/Preview da Vercel.
  - Validado direto na API da Resend (envio pra `delivered@resend.dev`, endereço de teste deles) que destinatário externo agora é aceito sem 403.
  - Deploy em produção feito (`vercel deploy --prod`).

## 🚧 TODO conhecido (não bloqueante agora)
- Upload de print removido do formulário a pedido do Marcelo (`printUrl` continua no schema, reativar quando fizer sentido — decidir storage: Vercel Blob, já que filesystem local não funciona no Vercel)
- E-mail do magic link sai de `login@meutrade.app` (domínio de outro projeto) — se quiser um remetente com a cara do Copy Nômade Trader, precisa verificar um domínio próprio dele na Resend depois
- Neon free tier hiberna por inatividade — primeira request depois de um tempo parado pode falhar, segunda tentativa sempre funciona. Normal, não é bug.

## 📋 Próximos passos (retomar amanhã)
Todos os marcos do roteiro original estão prontos, testados e no ar. Falta alinhar com o Marcelo o que vem depois — candidatos:
1. Domínio de e-mail próprio verificado na Resend, com a cara do projeto (hoje usa `meutrade.app` emprestado de outro projeto — funcional, mas não é a marca certa)
2. Cadastro/gestão de investidores pelo admin (hoje só existe onboarding pelo próprio investidor)
3. Reativar upload de print (Vercel Blob)
4. Domínio customizado (não `.vercel.app`)
5. Mais campos no cadastro do investidor, se fizer sentido depois (telefone/CPF foram cogitados e adiados por decisão do Marcelo)

## 🔧 Configurações importantes
- `DATABASE_URL` (Neon) — configurada local (`.env`) e em produção (Vercel), mesmo banco pros dois por enquanto
- `ADMIN_PASSWORD` / `ADMIN_SESSION_SECRET` — painel interno. **Senha de produção é diferente da de dev** (`admin123` só existe local)
- `AUTH_SECRET` / `AUTH_URL` / `RESEND_API_KEY` / `EMAIL_FROM` — magic link do investidor. `AUTH_URL` em produção = `https://copy-nomade-trader.vercel.app`

## ⚠️ Fora do código (nota da sessão)
- Ao salvar a memória de projeto do Claude, houve uma colisão de nome com outra memória já existente (era sobre a landing page antiga do Matheus em `Copytrade/landing`, projeto separado). Corrigido na hora — memória do projeto atual está em `project_copy_nomade_trader_plataforma`.

## 📚 Dependências principais
- next@14.2.x, prisma@6, @prisma/client@6, next-auth@5.0.0-beta, @auth/prisma-adapter, resend, zod, date-fns, recharts
