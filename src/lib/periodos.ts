import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  subDays,
  subWeeks,
  subMonths,
  subYears,
  isWeekend,
  format,
} from "date-fns";
import { ptBR } from "date-fns/locale";

export type TipoPeriodo = "diario" | "semanal" | "mensal" | "semestral" | "anual";

export const TIPOS_PERIODO: { valor: TipoPeriodo; label: string }[] = [
  { valor: "diario", label: "Diário" },
  { valor: "semanal", label: "Semanal" },
  { valor: "mensal", label: "Mensal" },
  { valor: "semestral", label: "Semestral" },
  { valor: "anual", label: "Anual" },
];

export interface RangePeriodo {
  inicio: Date;
  fim: Date;
  label: string;
}

function rangeSemestre(data: Date): { inicio: Date; fim: Date } {
  const ano = data.getFullYear();
  const primeiroSemestre = data.getMonth() < 6;
  const inicio = startOfDay(new Date(ano, primeiroSemestre ? 0 : 6, 1));
  const fim = endOfDay(new Date(ano, primeiroSemestre ? 5 : 11, primeiroSemestre ? 30 : 31));
  return { inicio, fim };
}

/** Calcula o intervalo fechado (início/fim) do tipo de período que contém `dataReferencia`. */
export function calcularRange(tipo: TipoPeriodo, dataReferencia: Date): RangePeriodo {
  switch (tipo) {
    case "diario": {
      const inicio = startOfDay(dataReferencia);
      const fim = endOfDay(dataReferencia);
      return { inicio, fim, label: format(inicio, "dd 'de' MMMM", { locale: ptBR }) };
    }
    case "semanal": {
      const inicio = startOfWeek(dataReferencia, { weekStartsOn: 1 });
      const fim = endOfWeek(dataReferencia, { weekStartsOn: 1 });
      return {
        inicio,
        fim,
        label: `${format(inicio, "dd/MM")} – ${format(fim, "dd/MM/yyyy")}`,
      };
    }
    case "mensal": {
      const inicio = startOfMonth(dataReferencia);
      const fim = endOfMonth(dataReferencia);
      return { inicio, fim, label: format(inicio, "MMMM 'de' yyyy", { locale: ptBR }) };
    }
    case "semestral": {
      const { inicio, fim } = rangeSemestre(dataReferencia);
      const numero = dataReferencia.getMonth() < 6 ? "1º" : "2º";
      return { inicio, fim, label: `${numero} semestre de ${inicio.getFullYear()}` };
    }
    case "anual": {
      const inicio = startOfYear(dataReferencia);
      const fim = endOfYear(dataReferencia);
      return { inicio, fim, label: format(inicio, "yyyy") };
    }
  }
}

/** Data de referência que cai dentro do período fechado imediatamente anterior. */
export function periodoAnterior(tipo: TipoPeriodo, dataReferencia: Date): Date {
  switch (tipo) {
    case "diario":
      return subDays(dataReferencia, 1);
    case "semanal":
      return subWeeks(dataReferencia, 1);
    case "mensal":
      return subMonths(dataReferencia, 1);
    case "semestral":
      return subMonths(dataReferencia, 6);
    case "anual":
      return subYears(dataReferencia, 1);
  }
}

/** Data de referência que cai dentro do próximo período fechado. */
export function periodoSeguinte(tipo: TipoPeriodo, dataReferencia: Date): Date {
  switch (tipo) {
    case "diario":
      return addDays(dataReferencia, 1);
    case "semanal":
      return addWeeks(dataReferencia, 1);
    case "mensal":
      return addMonths(dataReferencia, 1);
    case "semestral":
      return addMonths(dataReferencia, 6);
    case "anual":
      return addYears(dataReferencia, 1);
  }
}

/** Quantidade de dias úteis (seg-sex) a partir de `desta data`, inclusive, até o fim do mês dela. */
export function diasUteisRestantesNoMes(dataReferencia: Date): number {
  const fim = endOfMonth(dataReferencia);
  let contador = 0;
  let cursor = startOfDay(dataReferencia);
  while (cursor <= fim) {
    if (!isWeekend(cursor)) contador++;
    cursor = addDays(cursor, 1);
  }
  return contador;
}
