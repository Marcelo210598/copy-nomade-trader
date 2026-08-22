"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface PontoCurva {
  data: string;
  retornoAcumulado: number;
}

export function CurvaCapitalChart({ dados }: { dados: PontoCurva[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={dados} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="curvaAccent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8a33d" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#e8a33d" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="data"
          tick={{ fill: "#8b8578", fontSize: 11, fontFamily: "var(--font-mono)" }}
          axisLine={{ stroke: "#262b31" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#8b8578", fontSize: 11, fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
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
          formatter={(value) => [`${Number(value).toFixed(2)}%`, "Retorno acumulado"]}
        />
        <Area
          type="monotone"
          dataKey="retornoAcumulado"
          stroke="#e8a33d"
          strokeWidth={2}
          fill="url(#curvaAccent)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
