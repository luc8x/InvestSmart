"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { subMonths, format, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Gasto, CATEGORIAS } from "./types"

interface OutgoingChartsProps {
  gastos: Gasto[]
  gastosPorCategoria: Array<{ categoria: string; total: number; percentual: number }>
}

export function OutgoingCharts({ gastos, gastosPorCategoria }: OutgoingChartsProps) {
  const dadosGraficoPizza = useMemo(() => {
    return gastosPorCategoria.map((item, index) => {
      const categoria = CATEGORIAS.find(c => c.nome === item.categoria)
      const colors = ['#A956F7', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16']
      return {
        name: item.categoria,
        value: item.total,
        color: colors[index % colors.length] || '#8884d8'
      }
    })
  }, [gastosPorCategoria])

  const dadosGraficoLinha = useMemo(() => {
    const ultimosSeisMeses = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), i)).reverse()

    return ultimosSeisMeses.map(mes => {
      const gastosDoMes = gastos.filter(gasto => isSameMonth(gasto.data, mes))
      const totalMes = gastosDoMes.reduce((acc, gasto) => acc + gasto.valor, 0)
      const fixos = gastosDoMes.filter(g => g.tipo === 'fixo').reduce((acc, g) => acc + g.valor, 0)
      const variaveis = gastosDoMes.filter(g => g.tipo === 'variavel').reduce((acc, g) => acc + g.valor, 0)

      return {
        mes: format(mes, 'MMM', { locale: ptBR }),
        total: totalMes,
        fixos,
        variaveis
      }
    })
  }, [gastos])

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200/50">
          <p className="text-sm font-medium text-gray-600">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm font-semibold" style={{ color: entry.color }}>
              {`${entry.dataKey === 'total' ? 'Total de Gastos' : entry.dataKey === 'fixos' ? 'Gastos Fixos' : 'Gastos Variáveis'}: ${formatarMoeda(entry.value)}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const total = dadosGraficoPizza.reduce((sum, item) => sum + item.value, 0)
      const percentage = ((data.value / total) * 100).toFixed(1)
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200/50">
          <div className="flex items-center gap-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <div>
              <p className="font-semibold text-gray-800">{data.name}</p>
              <p className="text-sm text-gray-600">
                {formatarMoeda(data.value)} ({percentage}%)
              </p>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const totalAtual = dadosGraficoLinha[dadosGraficoLinha.length - 1]?.total || 0
  const totalAnterior = dadosGraficoLinha[dadosGraficoLinha.length - 2]?.total || 0
  const variacao = totalAnterior > 0 ? ((totalAtual - totalAnterior) / totalAnterior * 100) : 0
  const maiorCategoria = gastosPorCategoria[0]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="gap-2 h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gastos por Categoria</CardTitle>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-4 h-4 rounded-full bg-purple-500" />
              <span className="text-sm font-light">{gastosPorCategoria.length} categorias</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <hr className="mb-4 border-gray-200" />
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                {[...Array(7)].map((_, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={50 + i * 40}
                    x2="100%"
                    y2={50 + i * 40}
                    stroke="rgba(0,0,0,0.09)"
                    strokeWidth={1}
                    strokeDasharray="4 4"
                  />
                ))}

                <Pie
                  data={dadosGraficoPizza}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                  labelLine={false}
                  style={{
                    fontSize: 8,
                    fontWeight: 500,
                    filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.05))",
                  }}
                >
                  {dadosGraficoPizza.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#gradient-${index})`}
                      style={{
                        transition: 'all 0.3s ease'
                      }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<PieTooltip />} />
                <defs>
                  {dadosGraficoPizza.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.8} />
                    </linearGradient>
                  ))}
                </defs>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Gasto</p>
              <p className="text-lg font-semibold text-purple-600">
                {formatarMoeda(dadosGraficoPizza.reduce((sum, item) => sum + item.value, 0))}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Maior Categoria</p>
              <p className="text-lg font-semibold text-purple-600">
                {maiorCategoria?.categoria || 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="gap-2 h-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tendência Mensal</CardTitle>
            <div className="flex items-center gap-2 text-gray-400">
              {variacao >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-light">
                {variacao >= 0 ? '+' : ''}{variacao.toFixed(1)}% este mês
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <hr className="mb-4 border-gray-200" />
          <div className="h-[330px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dadosGraficoLinha}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#A956F7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#A956F7" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFixos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVariaveis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="mes"
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
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#A956F7"
                  strokeWidth={2}
                  fill="url(#colorTotal)"
                  name="Total"
                />
                <Area
                  type="monotone"
                  dataKey="fixos"
                  stroke="#10B981"
                  strokeWidth={2}
                  fill="url(#colorFixos)"
                  name="Fixos"
                />
                <Area
                  type="monotone"
                  dataKey="variaveis"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="url(#colorVariaveis)"
                  name="Variáveis"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-500">Mês Atual</p>
              <p className="text-lg font-semibold text-gray-600">
                {formatarMoeda(totalAtual)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Variação</p>
              <p className={`text-lg font-semibold ${variacao >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {variacao >= 0 ? '+' : ''}{variacao.toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-500">Média Mensal</p>
              <p className="text-lg font-semibold text-purple-600">
                {formatarMoeda(dadosGraficoLinha.reduce((sum, item) => sum + item.total, 0) / dadosGraficoLinha.length)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}