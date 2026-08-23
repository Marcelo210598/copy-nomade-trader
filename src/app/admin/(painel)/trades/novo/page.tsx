import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { TradeForm } from "@/components/admin/TradeForm";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NovoTradePage() {
  const [ativos, configGeral] = await Promise.all([
    prisma.configAtivo.findMany({ where: { ativo: true }, orderBy: { nome: "asc" } }),
    prisma.configGeral.findUnique({ where: { id: "config" } }),
  ]);

  const pronto = ativos.length > 0 && configGeral !== null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Lançar trade</h1>
        <p className="mt-1 text-sm text-muted">
          Preencha os dados da operação — o resultado é calculado automaticamente.
        </p>
      </div>

      {!pronto ? (
        <Card>
          <p className="text-sm text-muted">
            Antes de lançar um trade, cadastre pelo menos um ativo e o capital de referência em{" "}
            <Link href="/admin/configuracoes" className="text-accent hover:underline">
              Configurações
            </Link>
            .
          </p>
        </Card>
      ) : (
        <Card>
          <TradeForm ativos={ativos} capitalReferencia={configGeral!.capitalReferencia} />
        </Card>
      )}
    </div>
  );
}
