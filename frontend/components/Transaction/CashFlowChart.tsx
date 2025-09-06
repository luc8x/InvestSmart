"use client"

import { useState } from "react"
import {
  LineChart as ReLineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ToolsCashFlowChart } from "./ToolsCashFlowChart"
import { CashFlowKPIs } from "./CashFlowKPIs"
import { ExportButton } from "./ExportButton"
import { TopTransactions } from "./TopTransactions"

interface CashFlowData {
  dia: string
  entrada: number
  saida: number
}

export function CashFlowChart() {
  const [chartData, setChartData] = useState<CashFlowData[]>([])
  const [previousData, setPreviousData] = useState<CashFlowData[]>([])
  const [currentPeriod, setCurrentPeriod] = useState<string>("Mensal")

  const handlePeriodChange = (data: CashFlowData[], previousData?: CashFlowData[], period?: string) => {
    setChartData(data)
    setPreviousData(previousData || [])
    setCurrentPeriod(period || "Mensal")
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-xl font-semibold">Fluxo de Caixa</CardTitle>
          <div className="flex items-center gap-4">
            <ToolsCashFlowChart onPeriodChange={handlePeriodChange} />
            <ExportButton data={chartData} period={currentPeriod} />
          </div>
        </div>
        <hr className=" mb-4 border-gray-200" />
        <CashFlowKPIs data={chartData} previousData={previousData} />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="dia" 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#9ca3af" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "#fff", 
                  borderRadius: 8, 
                  borderColor: "#e5e7eb",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)"
                }}
                labelStyle={{ color: "#4b5563", fontWeight: 500 }}
                formatter={(value: number, name: string) => [
                  `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                  name
                ]}
              />
              <Line
                type="monotone"
                dataKey="entrada"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ r: 4, fill: "#10b981" }}
                activeDot={{ r: 6, fill: "#10b981" }}
                name="Entradas"
              />
              <Line
                type="monotone"
                dataKey="saida"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ef4444" }}
                activeDot={{ r: 6, fill: "#ef4444" }}
                name="Saídas"
              />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
        
        <TopTransactions data={chartData} />
      </CardContent>
    </Card>
  )
}
