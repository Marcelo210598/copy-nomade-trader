import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatNumber } from "@/components/ui/StatNumber";
import { prisma } from "@/lib/prisma";

export default async function DashboardAdminPage() {
  const [total, publicados] = await Promise.all([
    prisma.trade.count(),
    prisma.trade.count({ where: { publicado: true } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Métricas por período, meta mensal e semáforo de saúde chegam no próximo marco.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Trades lançados</CardTitle>
          </CardHeader>
          <StatNumber value={String(total)} size="lg" />
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Publicados</CardTitle>
          </CardHeader>
          <StatNumber value={String(publicados)} size="lg" />
        </Card>
      </div>
    </div>
  );
}
