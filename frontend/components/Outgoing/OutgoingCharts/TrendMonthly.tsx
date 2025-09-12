"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { subMonths, format, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { TrendingUp, TrendingDown } from "lucide-react"
import { Gasto } from "../types"

export function TrendMonthly({ gastos }: { gastos: Gasto[] }) {

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

    const totalAtual = dadosGraficoLinha[dadosGraficoLinha.length - 1]?.total || 0
    const totalAnterior = dadosGraficoLinha[dadosGraficoLinha.length - 2]?.total || 0
    const variacao = totalAnterior > 0 ? ((totalAtual - totalAnterior) / totalAnterior * 100) : 0

    return (
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
                <div className="h-[33.4vh] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={dadosGraficoLinha}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#A956F7" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#A956F7" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorFixos" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#5cacf6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#5cacf6" stopOpacity={0} />
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
                                stroke="#0784f7"
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
                        <p className={`text-lg font-semibold ${variacao >= 0 ? 'text-gray-600' : 'text-purple-600'}`}>
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
    )
}