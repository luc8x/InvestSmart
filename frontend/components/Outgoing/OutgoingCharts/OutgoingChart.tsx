"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts"
import { subMonths, format, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Gasto } from "../types"

interface OutgoingChartsProps {
    gastos: Gasto[]
    gastosPorCategoria: Array<{ categoria: string; total: number; percentual: number }>
    hoveredIndex: number | null
    setHoveredIndex: (index: number | null) => void
}

export function OutgoingChart({ gastos, gastosPorCategoria, hoveredIndex, setHoveredIndex }: OutgoingChartsProps) {
    const dadosGraficoPizza = useMemo(() => {
        return gastosPorCategoria.map((item, index) => {
            const colors = ['#A956F7', '#3A1542', '#B440CF', '#712881', '#5B2069', '#7D2C8F', '#06B6D4', '#84CC16']
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

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        {[...Array(8)].map((_, i) => (
                            <line
                                key={i}
                                x1="1%"
                                y1={50 + i * 40}
                                x2="99%"
                                y2={50 + i * 40}
                                stroke="rgba(0,0,0,0.09)"
                                strokeWidth={1}
                                strokeDasharray="4 4"
                                className=""
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
                            onMouseEnter={(_, index) => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                fontSize: 8,
                                fontWeight: 500,
                                filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.05))",
                            }}
                        >
                            {dadosGraficoPizza.map((e, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={`url(#gradient-${index})`}
                                    style={{
                                        filter: hoveredIndex !== null && hoveredIndex !== index ? 'brightness(0.7)' : 'brightness(1)',
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
        </div>
    )
}