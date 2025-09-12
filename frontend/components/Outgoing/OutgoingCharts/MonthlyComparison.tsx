"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"
import { format, getMonth, getYear } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Gasto } from "../types"
import { Label } from "@/components/ui/label"
import { ChartColumnDecreasing } from "lucide-react"

export function MonthlyComparison({ gastos }: { gastos: Gasto[] }) {
    const [mesComparacao1, setMesComparacao1] = useState('')
    const [mesComparacao2, setMesComparacao2] = useState('')

    const mesesDisponiveis = useMemo(() => {
        const mesesUnicos = new Set<string>()
        gastos.forEach(gasto => {
            const data = new Date(gasto.data)
            const chave = `${getMonth(data)}-${getYear(data)}`
            mesesUnicos.add(chave)
        })
        
        return Array.from(mesesUnicos)
            .map(chave => {
                const [mes, ano] = chave.split('-').map(Number)
                const data = new Date(ano, mes, 1)
                return {
                    chave,
                    label: format(data, 'MMMM yyyy', { locale: ptBR }),
                    data
                }
            })
            .sort((a, b) => b.data.getTime() - a.data.getTime())
    }, [gastos])

    const dadosComparacao = useMemo(() => {
        if (!mesComparacao1 || !mesComparacao2) {
            return {
                dadosUnificados: [],
                dadosMes1: [],
                dadosMes2: []
            }
        }

        const calcularDadosDiarios = (chavemes: string) => {
            const [mes, ano] = chavemes.split('-').map(Number)
            const primeiroDia = new Date(ano, mes, 1)
            const ultimoDia = new Date(ano, mes + 1, 0)
            const diasDoMes = ultimoDia.getDate()
            
            const dadosDiarios = []
            
            for (let dia = 1; dia <= diasDoMes; dia++) {
                const dataAtual = new Date(ano, mes, dia)
                const gastosNoDia = gastos.filter(gasto => {
                    const dataGasto = new Date(gasto.data)
                    return dataGasto.toDateString() === dataAtual.toDateString()
                })
                
                const totalDia = gastosNoDia.reduce((acc, gasto) => acc + gasto.valor, 0)
                
                dadosDiarios.push({
                    dia,
                    data: format(dataAtual, 'dd/MM', { locale: ptBR }),
                    total: totalDia,
                    mes: format(primeiroDia, 'MMM/yy', { locale: ptBR }),
                    mesCompleto: format(primeiroDia, 'MMMM yyyy', { locale: ptBR })
                })
            }
            
            return dadosDiarios
        }

        const dadosMes1 = calcularDadosDiarios(mesComparacao1)
        const dadosMes2 = calcularDadosDiarios(mesComparacao2)
        
        const maxDias = Math.max(dadosMes1.length, dadosMes2.length)
        const dadosUnificados = []
        
        for (let i = 0; i < maxDias; i++) {
            const dadoDia1 = dadosMes1[i]
            const dadoDia2 = dadosMes2[i]
            
            dadosUnificados.push({
                dia: i + 1,
                data: `${i + 1}`,
                mes1: dadoDia1?.total || 0,
                mes2: dadoDia2?.total || 0,
                labelMes1: dadosMes1[0]?.mes || '',
                labelMes2: dadosMes2[0]?.mes || '',
                mesCompleto1: dadosMes1[0]?.mesCompleto || '',
                mesCompleto2: dadosMes2[0]?.mesCompleto || ''
            })
        }
        
        return { dadosUnificados, dadosMes1, dadosMes2 }
    }, [gastos, mesComparacao1, mesComparacao2])

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor)
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0]?.payload
            return (
                <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-xl border border-gray-200/50">
                    <p className="text-sm font-medium text-gray-800 mb-2">Dia {label}</p>
                    <div className="space-y-1">
                        {payload.map((entry: any, index: number) => (
                            <p key={index} className="text-sm font-semibold capitalize" style={{ color: entry.color }}>
                                {entry.dataKey === 'mes1' ? data?.mesCompleto1 : data?.mesCompleto2}: {formatarMoeda(entry.value)}
                            </p>
                        ))}
                    </div>
                </div>
            )
        }
        return null
    }

    const { dadosUnificados, dadosMes1, dadosMes2 } = dadosComparacao
    const totalMes1 = dadosMes1.reduce((acc, dia) => acc + dia.total, 0)
    const totalMes2 = dadosMes2.reduce((acc, dia) => acc + dia.total, 0)
    const diferencaTotal = Math.abs(totalMes1 - totalMes2)
    const percentualVariacao = totalMes2 > 0 ? Math.abs((totalMes1 - totalMes2) / totalMes2 * 100) : 0

    return (
        <Card className="gap-2 h-full">
            <CardHeader>
                <CardTitle>Comparação Entre Meses</CardTitle>
            </CardHeader>
            <CardContent>
                <hr className="mb-4 border-gray-200" />
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="mes" className="text-sm font-medium">Primeiro Mês</Label>
                        <Select value={mesComparacao1} onValueChange={setMesComparacao1}>
                            <SelectTrigger className="w-60">
                                <SelectValue placeholder="Selecione um mês" />
                            </SelectTrigger>
                            <SelectContent>
                                {mesesDisponiveis.map(mes => (
                                    <SelectItem key={mes.chave} value={mes.chave}>
                                        {mes.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="mes" className="text-sm font-medium">Segundo Mês</Label>
                        <Select value={mesComparacao2} onValueChange={setMesComparacao2}>
                            <SelectTrigger className="w-60">
                                <SelectValue placeholder="Selecione um mês" />
                            </SelectTrigger>
                            <SelectContent>
                                {mesesDisponiveis.map(mes => (
                                    <SelectItem key={mes.chave} value={mes.chave}>
                                        {mes.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="h-[33.4vh] w-full">
                    {!mesComparacao1 || !mesComparacao2 ? (
                        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                                    <ChartColumnDecreasing className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecione os meses para comparar</h3>
                                <p className="text-sm text-gray-500">Escolha dois meses nos seletores acima para visualizar a comparação diária de gastos.</p>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dadosUnificados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorMes1" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorMes2" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="data"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    interval={2}
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
                                    dataKey="mes1"
                                    stroke="#8B5CF6"
                                    strokeWidth={2}
                                    fill="url(#colorMes1)"
                                    name={dadosUnificados[0]?.labelMes1 || 'Primeiro Mês'}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="mes2"
                                    stroke="#10B981"
                                    strokeWidth={2}
                                    fill="url(#colorMes2)"
                                    name={dadosUnificados[0]?.labelMes2 || 'Segundo Mês'}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Diferença Total</p>
                        <p className={`text-lg font-semibold text-gray-700`}>
                            {formatarMoeda(diferencaTotal)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Primeiro Mês</p>
                        <p className="text-lg font-semibold text-purple-600">
                            {formatarMoeda(totalMes1)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Segundo Mês</p>
                        <p className="text-lg font-semibold text-purple-600">
                            {formatarMoeda(totalMes2)}
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-500">Variação %</p>
                        <p className={`text-lg font-semibold text-gray-700`}>
                            {percentualVariacao.toFixed(1)}%
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}