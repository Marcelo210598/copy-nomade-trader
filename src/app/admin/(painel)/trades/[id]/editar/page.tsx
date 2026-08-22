import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { TradeEditForm } from "@/components/admin/TradeEditForm";
import { prisma } from "@/lib/prisma";

export default async function EditarTradePage({ params }: { params: { id: string } }) {
  const [trade, ativos, configGeral] = await Promise.all([
    prisma.trade.findUnique({ where: { id: params.id } }),
    prisma.configAtivo.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
    prisma.configGeral.findUnique({ where: { id: "config" } }),
  ]);

  if (!trade || !configGeral) notFound();

  // garante que o ativo atual do trade aparece no seletor mesmo se tiver sido desativado depois
  // (busca o valorPorPonto real dele, em vez de assumir zero)
  let ativosDisponiveis = ativos;
  if (!ativos.some((a) => a.nome === trade.ativo)) {
    const ativoDoTrade = await prisma.configAtivo.findUnique({ where: { nome: trade.ativo } });
    if (ativoDoTrade) ativosDisponiveis = [...ativos, ativoDoTrade];
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Corrigir trade</h1>
        <p className="mt-1 text-sm text-muted">
          {trade.ativo} · {trade.data.toLocaleDateString("pt-BR")} — a correção fica registrada no
          histórico, o valor anterior nunca é perdido.
        </p>
      </div>

      <Card>
        <TradeEditForm
          trade={{
            id: trade.id,
            data: trade.data.toISOString().slice(0, 10),
            ativo: trade.ativo,
            lado: trade.lado,
            precoEntrada: trade.precoEntrada,
            precoSaida: trade.precoSaida,
            contratos: trade.contratos,
            observacao: trade.observacao ?? "",
          }}
          ativos={ativosDisponiveis}
          capitalReferencia={configGeral.capitalReferencia}
        />
      </Card>
    </div>
  );
}
