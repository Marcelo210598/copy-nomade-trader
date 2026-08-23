"use client";

import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { completarOnboarding } from "@/app/investidor/(area)/actions";

export function OnboardingForm() {
  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <form action={completarOnboarding} className="flex flex-col gap-5">
      <div>
        <Label htmlFor="capitalInicial">Capital inicial (R$)</Label>
        <Input
          id="capitalInicial"
          name="capitalInicial"
          type="number"
          step="0.01"
          min="0"
          placeholder="10000.00"
          required
        />
        <p className="mt-1 text-xs text-muted">
          O valor que você tá "colocando" pra acompanhar o copy — nada disso é movimentado de
          verdade.
        </p>
      </div>

      <div>
        <Label htmlFor="dataInicio">Data de entrada</Label>
        <Input id="dataInicio" name="dataInicio" type="date" defaultValue={hoje} required />
        <p className="mt-1 text-xs text-muted">
          Trades lançados antes dessa data não entram no seu saldo.
        </p>
      </div>

      <Button type="submit" size="lg">
        Começar a acompanhar
      </Button>
    </form>
  );
}
