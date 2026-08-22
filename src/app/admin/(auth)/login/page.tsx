import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { loginAdmin } from "./actions";

export default function LoginAdminPage({
  searchParams,
}: {
  searchParams: { erro?: string };
}) {
  const temErro = searchParams.erro === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="font-display text-sm font-semibold tracking-tight">
            Copy Nomade Trader
          </span>
        </div>

        <Card>
          <p className="mb-4 text-xs font-medium uppercase tracking-wider text-muted">
            Painel interno
          </p>

          <form action={loginAdmin} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input id="senha" name="senha" type="password" required autoFocus placeholder="••••••••" />
            </div>

            {temErro && (
              <p className="rounded-md border border-loss/30 bg-loss/10 px-3 py-2 text-xs text-loss">
                Senha incorreta. Tenta de novo.
              </p>
            )}

            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
