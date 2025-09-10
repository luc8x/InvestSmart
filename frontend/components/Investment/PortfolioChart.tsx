"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingUp } from "lucide-react"

const portfolioData = [
  { month: 'Jan', valor: 65000, rentabilidade: 2.1 },
  { month: 'Fev', valor: 68500, rentabilidade: 5.4 },
  { month: 'Mar', valor: 72300, rentabilidade: 11.5 },
  { month: 'Abr', valor: 69800, rentabilidade: 7.4 },
  { month: 'Mai', valor: 75600, rentabilidade: 16.2 },
  { month: 'Jun', valor: 78900, rentabilidade: 21.4 },
  { month: 'Jul', valor: 82100, rentabilidade: 26.3 },
  { month: 'Ago', valor: 79500, rentabilidade: 22.3 },
  { month: 'Set', valor: 83200, rentabilidade: 27.9 },
  { month: 'Out', valor: 85420, rentabilidade: 31.4 }
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-600">{`${label}`}</p>
        <p className="text-sm font-semibold text-purple-500">
          {`Valor: R$ ${payload[0].value.toLocaleString('pt-BR')}`}
        </p>
        <p className="text-sm font-light text-gray-400">
          {`Rentabilidade: +${payload[0].payload.rentabilidade}%`}
        </p>
      </div>
    )
  }
  return null
}

export function PortfolioChart() {
  const currentValue = portfolioData[portfolioData.length - 1].valor
  const previousValue = portfolioData[portfolioData.length - 2].valor
  const growth = ((currentValue - previousValue) / previousValue * 100).toFixed(1)

  return (
    <Card className="gap-2 h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Rentabilidade da Carteira</CardTitle>
          <div className="flex items-center gap-2 text-gray-400">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-light">+{growth}% este mês</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <hr className="mb-4 border-gray-200" />
        <div className="h-[330px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={portfolioData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A956F7" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#A956F7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="valor"
                stroke="#A956F7"
                strokeWidth={2}
                fill="url(#colorValue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-500">Valor Atual</p>
            <p className="text-lg font-semibold text-gray-600">
              R$ {currentValue.toLocaleString('pt-BR')}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Rentabilidade Total</p>
            <p className="text-lg font-semibold text-gray-600">+31.4%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Melhor Mês</p>
            <p className="text-lg font-semibold text-purple-600">Junho (+21.4%)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}