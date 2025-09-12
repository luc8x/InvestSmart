"use client"

import { useState, useEffect, useMemo } from "react"
import { TrendingDown, DollarSign, PieChart, List, Target } from "lucide-react"
import { CardInfo } from "@/components/LayoutBase/CardInfo"
import { HeaderLayout } from "@/components/LayoutBase/HeaderPage"
import { OutgoingList, Gasto, CATEGORIAS,OutgoingForm, InsightsCard, MonthlyComparison } from "@/components/Outgoing"
import { TrendMonthly } from "@/components/Outgoing/OutgoingCharts/TrendMonthly"
import { OutgoingCategory } from "@/components/Outgoing/OutgoingCharts/OutgoingCategory"
import { OutgoingBudget } from "@/components/Outgoing/OutgoingBudget/OutgoingBudget"

export default function GastosPage() {
    const [gastos, setGastos] = useState<Gasto[]>([])
    const [filtroMes, setFiltroMes] = useState(new Date().getMonth())
    const [filtroAno, setFiltroAno] = useState(new Date().getFullYear())
    const [activeTab, setActiveTab] = useState('lista')

    useEffect(() => {
        const gastosStorage = localStorage.getItem('gastos')
        if (gastosStorage) {
            const gastosParseados = JSON.parse(gastosStorage).map((gasto: any) => ({
                ...gasto,
                data: new Date(gasto.data)
            }))
            setGastos(gastosParseados)
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('gastos', JSON.stringify(gastos))
    }, [gastos])

    const adicionarGasto = (novoGasto: Omit<Gasto, 'id'>) => {
        const gasto: Gasto = {
            id: Date.now().toString(),
            ...novoGasto
        }
        setGastos([...gastos, gasto])
    }

    const gastosFiltrados = gastos

    const { totalGastos, gastosPorCategoria, gastosFixos, gastosVariaveis } = useMemo(() => {
        const gastosDoMes = gastos.filter(gasto => {
            const mesGasto = gasto.data.getMonth()
            const anoGasto = gasto.data.getFullYear()
            return mesGasto === filtroMes && anoGasto === filtroAno
        })

        const total = gastosDoMes.reduce((acc, gasto) => acc + gasto.valor, 0)

        const categorias = CATEGORIAS.map(categoria => {
            const gastosCategoria = gastosDoMes.filter(gasto => gasto.categoria === categoria.nome)
            const totalCategoria = gastosCategoria.reduce((acc, gasto) => acc + gasto.valor, 0)
            return {
                ...categoria,
                total: totalCategoria,
                gastos: gastosCategoria.length,
                percentual: total > 0 ? (totalCategoria / total) * 100 : 0
            }
        }).filter(categoria => categoria.total > 0)

        const fixos = gastosDoMes.filter(gasto => gasto.tipo === 'fixo').reduce((acc, gasto) => acc + gasto.valor, 0)
        const variaveis = gastosDoMes.filter(gasto => gasto.tipo === 'variavel').reduce((acc, gasto) => acc + gasto.valor, 0)

        return {
            totalGastos: total,
            gastosPorCategoria: categorias,
            gastosFixos: fixos,
            gastosVariaveis: variaveis
        }
    }, [gastos, filtroMes, filtroAno])

    return (
        <div className="flex flex-col gap-6 p-6">
            <div className="flex items-center justify-between">
                <HeaderLayout moduleName="Controle de Gastos" description="Gerencie suas despesas e mantenha o controle financeiro" />
                <OutgoingForm onAdicionarGasto={adicionarGasto} />
            </div>

            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
                <CardInfo metrics={useMemo(() => [
                    {
                        title: "Total do Mês",
                        value: `R$ ${totalGastos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        icon: DollarSign,
                        bg: "bg-blue-100",
                        color: "text-blue-600",
                        indicator: `${gastos.filter(g => g.data.getMonth() === filtroMes && g.data.getFullYear() === filtroAno).length} transações`
                    },
                    {
                        title: "Gastos Fixos",
                        value: `R$ ${gastosFixos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        icon: TrendingDown,
                        bg: "bg-yellow-100",
                        color: "text-yellow-600",
                        indicator: `${totalGastos > 0 ? ((gastosFixos / totalGastos) * 100).toFixed(1) : 0}% do total`
                    },
                    {
                        title: "Gastos Variáveis",
                        value: `R$ ${gastosVariaveis.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
                        icon: TrendingDown,
                        bg: "bg-orange-100",
                        color: "text-orange-600",
                        indicator: `${totalGastos > 0 ? ((gastosVariaveis / totalGastos) * 100).toFixed(1) : 0}% do total`
                    },
                    {
                        title: "Categorias Ativas",
                        value: gastosPorCategoria.length,
                        icon: PieChart,
                        bg: "bg-purple-100",
                        color: "text-purple-600",
                        indicator: `de ${CATEGORIAS.length} disponíveis`
                    }
                ], [totalGastos, gastosFixos, gastosVariaveis, gastosPorCategoria.length, gastosFiltrados.length])} />
            </div>

            <InsightsCard 
                gastos={gastos}
                gastosFiltrados={gastosFiltrados}
                gastosPorCategoria={gastosPorCategoria}
                totalGastos={totalGastos}
                insightsAtivos={true}
                onToggleInsights={() => {}}
            />

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
                <div className="w-full flex flex-col gap-7">
                    <div className="grid w-full grid-cols-3 h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
                        <a 
                            onClick={() => setActiveTab('lista')}
                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                                activeTab === 'lista' ? 'bg-background text-foreground shadow-sm' : 'cursor-pointer'
                            }`}
                        >
                            <List className="w-3 h-3 mr-1" />Lista de Gastos
                        </a>
                        <a 
                            onClick={() => setActiveTab('grafico')}
                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                                activeTab === 'grafico' ? 'bg-background text-foreground shadow-sm' : 'cursor-pointer'
                            }`}
                        >
                            <PieChart className="w-3 h-3 mr-1" />Gráficos
                        </a>
                        <a 
                            onClick={() => setActiveTab('metas')}
                            className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-xs font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                                activeTab === 'metas' ? 'bg-background text-foreground shadow-sm' : 'cursor-pointer'
                            }`}
                        >
                            <Target className="w-3 h-3 mr-1" />Metas Orçamentarias
                        </a>
                    </div>

                    <div className="min-h-[400px]">
                        {activeTab === 'lista' && (
                            <div className="space-y-4 animate-in slide-in-from-right-5 fade-in duration-300">
                                <OutgoingList gastos={gastos} />
                            </div>
                        )}

                        {activeTab === 'grafico' && (
                            <div className="space-y-4 animate-in slide-in-from-right-5 fade-in duration-300">
                                <div className="grid grid-cols-1 gap-7">
                                    <div className="grid grid-cols-2 gap-7">
                                        <OutgoingCategory gastos={gastos} />
                                        <TrendMonthly gastos={gastos} />
                                    </div>
                                    <div className="w-full">
                                        <MonthlyComparison gastos={gastos} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'metas' && (
                            <div className="space-y-4 animate-in slide-in-from-right-5 fade-in duration-300">
                                <OutgoingBudget />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
