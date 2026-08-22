import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { prisma } from "@/lib/prisma";
import { alternarAtivo, criarAtivo, salvarConfigGeral } from "./actions";

export default async function ConfiguracoesPage() {
  const [ativos, configGeral] = await Promise.all([
    prisma.configAtivo.findMany({ orderBy: { nome: "asc" } }),
    prisma.configGeral.findUnique({ where: { id: "config" } }),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-semibold">Configurações</h1>
        <p className="mt-1 text-sm text-muted">
          Ativos e capital de referência precisam estar cadastrados antes de lançar trades.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ativos</CardTitle>
        </CardHeader>

        <div className="flex flex-col gap-2">
          {ativos.length === 0 && (
            <p className="text-sm text-muted">Nenhum ativo cadastrado ainda.</p>
          )}
          {ativos.map((ativo) => (
            <div
              key={ativo.id}
              className="flex items-center justify-between rounded-lg border border-border bg-elevated px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-tabular text-sm font-semibold">{ativo.nome}</span>
                <span className="font-tabular text-xs text-muted">
                  R$ {ativo.valorPorPonto.toLocaleString("pt-BR")} / ponto
                </span>
                <Badge variant={ativo.ativo ? "profit" : "neutral"}>
                  {ativo.ativo ? "Ativo" : "Desativado"}
                </Badge>
              </div>
              <form action={alternarAtivo.bind(null, ativo.id)}>
                <Button type="submit" variant="ghost" size="sm">
                  {ativo.ativo ? "Desativar" : "Reativar"}
                </Button>
              </form>
            </div>
          ))}
        </div>

        <form action={criarAtivo} className="mt-4 flex items-end gap-3 border-t border-border pt-4">
          <div className="flex-1">
            <Label htmlFor="nome">Nome do ativo</Label>
            <Input id="nome" name="nome" placeholder="NQ" maxLength={10} required />
          </div>
          <div className="flex-1">
            <Label htmlFor="valorPorPonto">Valor do ponto (R$)</Label>
            <Input
              id="valorPorPonto"
              name="valorPorPonto"
              type="number"
              step="0.01"
              min="0"
              placeholder="10.00"
              required
            />
          </div>
          <Button type="submit" size="md">
            Adicionar
          </Button>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Geral</CardTitle>
        </CardHeader>

        <form action={salvarConfigGeral} className="flex flex-col gap-4">
          <div>
            <Label htmlFor="capitalReferencia">Capital de referência (R$)</Label>
            <Input
              id="capitalReferencia"
              name="capitalReferencia"
              type="number"
              step="0.01"
              min="0"
              defaultValue={configGeral?.capitalReferencia ?? ""}
              placeholder="50000.00"
              required
            />
            <p className="mt-1 text-xs text-muted">
              Usado pra calcular o % de retorno de cada trade lançado.
            </p>
          </div>
          <div>
            <Label htmlFor="metaMensalPercentual">Meta mensal (%)</Label>
            <Input
              id="metaMensalPercentual"
              name="metaMensalPercentual"
              type="number"
              step="0.1"
              min="0"
              defaultValue={configGeral?.metaMensalPercentual ?? ""}
              placeholder="8"
              required
            />
          </div>
          <Button type="submit" className="w-fit">
            Salvar
          </Button>
        </form>
      </Card>
    </div>
  );
}
