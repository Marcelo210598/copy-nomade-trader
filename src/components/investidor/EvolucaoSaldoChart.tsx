"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { PontoSaldo } from "@/lib/saldo-investidor";
import { formatarMoeda } from "@/lib/utils";

export function EvolucaoSaldoChart({ dados }: { dados: PontoSaldo[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={dados} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#262b31" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: "#8b8578", fontSize: 11, fontFamily: "var(--font-mono)" }}
          axisLine={{ stroke: "#262b31" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#8b8578", fontSize: 11, fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: "#1c2126",
            border: "1px solid #262b31",
            borderRadius: 8,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
          }}
          labelStyle={{ color: "#8b8578" }}
          formatter={(value, name) => [
            formatarMoeda(Number(value)),
            name === "saldoComposto" ? "Composto" : "Linear",
          ]}
        />
        <Legend
          formatter={(value) => (value === "saldoComposto" ? "Composto" : "Linear")}
          wrapperStyle={{ fontSize: 12, fontFamily: "var(--font-mono)", color: "#8b8578" }}
        />
        <Line
          type="monotone"
          dataKey="saldoComposto"
          stroke="#e8a33d"
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="saldoLinear"
          stroke="#8b8578"
          strokeWidth={2}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
