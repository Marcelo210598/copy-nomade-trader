import { Card } from "@/components/ui/Card";

export default function VerifiqueEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mb-6 flex items-center justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="font-display text-sm font-semibold tracking-tight">
            Copy Nomade Trader
          </span>
        </div>

        <Card>
          <p className="text-4xl">📬</p>
          <h1 className="mt-4 font-display text-lg font-semibold">Confira seu e-mail</h1>
          <p className="mt-2 text-sm text-muted">
            Mandamos um link de acesso. Clica nele pra entrar — pode fechar essa aba.
          </p>
        </Card>
      </div>
    </main>
  );
}
