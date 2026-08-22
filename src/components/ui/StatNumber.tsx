import { cn } from "@/lib/utils";

type Tone = "accent" | "profit" | "loss" | "neutral" | "auto";
type Size = "sm" | "md" | "lg" | "xl";

interface StatNumberProps {
  value: string;
  tone?: Tone;
  size?: Size;
  className?: string;
}

const toneClasses: Record<Exclude<Tone, "auto">, string> = {
  accent: "text-accent",
  profit: "text-profit",
  loss: "text-loss",
  neutral: "text-foreground",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
};

/**
 * Número em destaque tipográfico forte (retorno, saldo, %).
 * "auto" infere a cor pelo sinal do primeiro caractere (+/-) do value.
 */
export function StatNumber({ value, tone = "neutral", size = "lg", className }: StatNumberProps) {
  const resolvedTone: Exclude<Tone, "auto"> =
    tone === "auto" ? (value.startsWith("-") ? "loss" : value.startsWith("+") ? "profit" : "neutral") : tone;

  return (
    <span
      className={cn(
        "font-tabular font-semibold leading-none tracking-tight",
        toneClasses[resolvedTone],
        sizeClasses[size],
        className
      )}
    >
      {value}
    </span>
  );
}
