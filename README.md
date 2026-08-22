# Copy Nômade Trader

Plataforma standalone para o Matheus (trader/mentor) divulgar e vender seu serviço de copytrade através de um histórico de resultados público, com painel interno de lançamento de trades e área do investidor com saldo simulado.

## Stack

- **Next.js 14** (App Router) + TypeScript
- **Prisma ORM** + **Neon PostgreSQL**
- **Tailwind CSS**
- **NextAuth v5** (magic link via **Resend**) — área do investidor
- Painel interno protegido por senha compartilhada (env var)
- Deploy: **Vercel**

## Três áreas

1. **Painel interno** (`/admin`) — protegido por senha. Lançamento de trades, dashboard com métricas por período, meta mensal e semáforo de saúde, configurações.
2. **Página pública** (`/`) — vitrine de vendas: estatísticas agregadas, curva de capital, capital total sob acompanhamento.
3. **Área do investidor** (`/investidor`) — login por magic link. Saldo simulado (composto vs linear), evolução do capital.

## Rodando localmente

```bash
npm install
cp .env.example .env   # preencher DATABASE_URL, ADMIN_PASSWORD, AUTH_SECRET, RESEND_API_KEY
npx prisma migrate dev
npm run dev
```

Acesse http://localhost:3000

## Estrutura

```
copy-nomade-trader/
├── .env.example
├── progress.md          # progresso atualizado a cada sessão
├── historico/           # snapshots de cada sessão de trabalho
├── prisma/
│   └── schema.prisma
└── src/
    ├── app/
    │   ├── (public)/     # página pública, sem login
    │   ├── admin/        # painel interno (senha)
    │   └── investidor/   # área logada (magic link)
    ├── components/
    ├── lib/
    └── styles/
```

## Modelo de dados

- **Trade** — operação lançada, com resultado calculado e flag `publicado`
- **TradeEdicao** — log de correções (nunca sobrescreve silenciosamente)
- **ConfigAtivo** — ativos cadastrados (NQ, MNQ, ES, MES...) + valor do ponto
- **ConfigGeral** — capital de referência, meta mensal, thresholds do semáforo
- **Investidor** — email, capital inicial, data de início do copy

## Nota sobre "capital sob acompanhamento"

Os valores são **simulados** com base no capital informado por cada investidor — a plataforma não custodia nem movimenta dinheiro real.
