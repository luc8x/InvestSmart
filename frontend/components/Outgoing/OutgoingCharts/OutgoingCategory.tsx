"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Filter, X } from "lucide-react"
import { Gasto } from "../types"
import OutgoingMetrics from "./OutgoingMetrics"
import { OutgoingChart } from "./OutgoingChart"
import { Label } from "@/components/ui/label"

export function OutgoingCategory({ gastos }: { gastos: Gasto[] }) {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
    const [filtroCategoria, setFiltroCategoria] = useState<string>('todas')
    const [filtroTipo, setFiltroTipo] = useState<string>('todos')
    const [filtroPeriodo, setFiltroPeriodo] = useState<string>('todos')

    const gastosFiltrados = useMemo(() => {
        return gastos.filter(gasto => {
            const categoriaMatch = filtroCategoria === 'todas' || gasto.categoria === filtroCategoria
            const tipoMatch = filtroTipo === 'todos' || gasto.tipo === filtroTipo

            let periodoMatch = true
            if (filtroPeriodo !== 'todos') {
                const hoje = new Date()
                const dataGasto = new Date(gasto.data)

                switch (filtroPeriodo) {
                    case 'mes_atual':
                        periodoMatch = dataGasto.getMonth() === hoje.getMonth() && dataGasto.getFullYear() === hoje.getFullYear()
                        break
                    case 'ultimos_30':
                        const trinta_dias = new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000)
                        periodoMatch = dataGasto >= trinta_dias
                        break
                    case 'ultimos_90':
                        const noventa_dias = new Date(hoje.getTime() - 90 * 24 * 60 * 60 * 1000)
                        periodoMatch = dataGasto >= noventa_dias
                        break
                }
            }

            return categoriaMatch && tipoMatch && periodoMatch
        })
    }, [gastos, filtroCategoria, filtroTipo, filtroPeriodo])

    const gastosPorCategoria = useMemo(() => {
        const categorias = gastosFiltrados.reduce((acc, gasto) => {
            const categoria = gasto.categoria
            if (!acc[categoria]) {
                acc[categoria] = { categoria, total: 0, percentual: 0 }
            }
            acc[categoria].total += gasto.valor
            return acc
        }, {} as Record<string, { categoria: string; total: number; percentual: number }>)

        const total = Object.values(categorias).reduce((sum, cat) => sum + cat.total, 0)
        return Object.values(categorias)
            .map(cat => ({ ...cat, percentual: (cat.total / total) * 100 }))
            .sort((a, b) => b.total - a.total)
    }, [gastosFiltrados])

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

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor)
    }

    const maiorCategoria = gastosPorCategoria[0]
    const categoriasUnicas = [...new Set(gastos.map(g => g.categoria))]
    const temFiltrosAtivos = filtroCategoria !== 'todas' || filtroTipo !== 'todos' || filtroPeriodo !== 'todos'

    const limparFiltros = () => {
        setFiltroCategoria('todas')
        setFiltroTipo('todos')
        setFiltroPeriodo('todos')
    }

    return (
        <Card className="gap-2 h-full">
            <CardHeader>
                <CardTitle>Distribuição de Gastos</CardTitle>

            </CardHeader>
            <CardContent>
                <hr className="mb-4 border-gray-200" />
                <div className="flex justify-between mb-5 items-center">
                    <div className="flex flex-wrap justify-between gap-7 items-center">
                        <div className="flex flex-col gap-1">
                            <Label htmlFor="mes" className="text-sm font-medium">Tipos</Label>
                            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                                <SelectTrigger className="w-60">
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos os Tipos</SelectItem>
                                    <SelectItem value="fixo">Fixo</SelectItem>
                                    <SelectItem value="variavel">Variável</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label htmlFor="mes" className="text-sm font-medium">Períodos</Label>
                            <Select value={filtroPeriodo} onValueChange={setFiltroPeriodo}>
                                <SelectTrigger className="w-60">
                                    <SelectValue placeholder="Período" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todos">Todos os Períodos</SelectItem>
                                    <SelectItem value="mes_atual">Mês Atual</SelectItem>
                                    <SelectItem value="ultimos_30">Últimos 30 dias</SelectItem>
                                    <SelectItem value="ultimos_90">Últimos 90 dias</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                    </div>
                    {temFiltrosAtivos && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={limparFiltros}
                            className="mt-7 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                            Limpar filtros
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <OutgoingChart
                        gastos={gastosFiltrados}
                        gastosPorCategoria={gastosPorCategoria}
                        hoveredIndex={hoveredIndex}
                        setHoveredIndex={setHoveredIndex}
                    />
                    <OutgoingMetrics
                        chartData={dadosGraficoPizza}
                        hoveredIndex={hoveredIndex}
                        formatCurrency={formatarMoeda}
                    />
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
    )
}