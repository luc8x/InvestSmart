"use client"

import {
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

const data = [
  { dia: "01 Jun", entrada: 1200, saida: 500 },
  { dia: "05 Jun", entrada: 900, saida: 300 },
  { dia: "10 Jun", entrada: 1400, saida: 800 },
  { dia: "15 Jun", entrada: 1800, saida: 1000 },
  { dia: "20 Jun", entrada: 2000, saida: 1600 },
  { dia: "25 Jun", entrada: 2500, saida: 1300 },
]

export function LineChart() {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ReLineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="dia" stroke="#9ca3af" />
        <YAxis stroke="#9ca3af" />
        <Tooltip
          contentStyle={{ backgroundColor: "#fff", borderRadius: 8, borderColor: "#e5e7eb" }}
          labelStyle={{ color: "#4b5563", fontWeight: 500 }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="entrada"
          stroke="#10b981"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Entradas"
        />
        <Line
          type="monotone"
          dataKey="saida"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Saídas"
        />
      </ReLineChart>
    </ResponsiveContainer>
  )
}
