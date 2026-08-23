import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { loginInvestidor } from "./actions";

export default function LoginInvestidorPage() {
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
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">
            Área do investidor
          </p>
          <p className="mb-4 text-sm text-muted">
            Digite seu e-mail — a gente manda um link de acesso, sem senha.
          </p>

          <form action={loginInvestidor} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoFocus
                placeholder="voce@email.com"
              />
            </div>

            <Button type="submit" className="w-full">
              Enviar link de acesso
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}
