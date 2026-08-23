# Copy Nômade Trader — Resumo Geral

Plataforma standalone pro Matheus (trader/mentor) vender copytrade via histórico de resultados. Três áreas: painel interno (senha, lançamento de trades), página pública (vitrine), área do investidor (magic link, saldo simulado composto/linear).

Stack: Next.js 14 + TS + Prisma 6 + Neon + Tailwind + NextAuth v5 (Resend).

22/08/2026: NO AR EM PRODUÇÃO — https://copy-nomade-trader.vercel.app. As 3 áreas do roteiro original prontas e testadas (painel interno completo, página pública com dados reais, área do investidor com magic link). Pendência conhecida: magic link pode cair no spam até ter domínio de e-mail próprio (ver progress.md). Repo: https://github.com/Marcelo210598/copy-nomade-trader

23/08/2026: bateria de testes completa em produção, tudo ✅. Corrigido bug de regra de negócio — trade lançado antes do investidor confirmar a entrada não conta mais no saldo dele (novo campo `entradaConfirmadaEm`, desempate por horário só no dia da confirmação). Domínio de e-mail próprio segue adiado, sem prazo, a pedido do Marcelo.

Ver `progress.md` na raiz do projeto para o estado atualizado.
