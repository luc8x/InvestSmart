"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingDown, DollarSign, PieChart } from "lucide-react"
import { CardInfo } from "@/components/LayoutBase/CardInfo"
import { format, subMonths, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { HeaderLayout } from "@/components/LayoutBase/HeaderPage"
import { 
  OutgoingList, 
  Gasto, 
  CATEGORIAS, 
  OutgoingForm,
  OutgoingCharts
} from "@/components/Outgoing"

export default function GastosPage() {
    const [gastos, setGastos] = useState<Gasto[]>([])
    const [filtroCategoria, setFiltroCategoria] = useState('todas')
    const [filtroMes, setFiltroMes] = useState(new Date().getMonth())
    const [filtroAno, setFiltroAno] = useState(new Date().getFullYear())
    const [busca, setBusca] = useState('')
    const [ordenacao, setOrdenacao] = useState<'data-desc' | 'data-asc' | 'valor-desc' | 'valor-asc' | 'categoria'>('data-desc')
    const [mostrarDuplicatas, setMostrarDuplicatas] = useState(false)
    const [gastosVisiveis, setGastosVisiveis] = useState(20)

    // Carrega gastos do localStorage
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

    // Salva gastos no localStorage
    useEffect(() => {
        localStorage.setItem('gastos', JSON.stringify(gastos))
    }, [gastos])

    // Funções principais
    const adicionarGasto = (novoGasto: Omit<Gasto, 'id'>) => {
        const gasto: Gasto = {
            id: Date.now().toString(),
            ...novoGasto
        }
        setGastos([...gastos, gasto])
    }

    const removerGasto = (id: string) => {
        setGastos(gastos.filter(gasto => gasto.id !== id))
    }

    const editarGasto = (id: string, dadosAtualizados: Partial<Gasto>) => {
        setGastos(gastos.map(gasto => 
            gasto.id === id ? { ...gasto, ...dadosAtualizados } : gasto
        ))
    }

    const carregarMaisGastos = () => {
        setGastosVisiveis(prev => prev + 20)
    }

    // Gastos sem filtro (filtros aplicados no OutgoingList)
    const gastosFiltrados = gastos

    // Cálculos baseados no mês/ano atual
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

    // Dados para gráficos
    const dadosGraficoPizza = gastosPorCategoria.map(categoria => ({
        name: categoria.nome,
        value: categoria.total,
        color: categoria.cor.replace('bg-', '#').replace('-500', '')
    }))

    const dadosGraficoLinha = useMemo(() => {
        const ultimosSeisMeses = Array.from({ length: 6 }, (_, i) => subMonths(new Date(), i)).reverse()
        return ultimosSeisMeses.map(mes => {
            const gastosDoMes = gastos.filter(gasto => isSameMonth(gasto.data, mes))
            const total = gastosDoMes.reduce((acc, gasto) => acc + gasto.valor, 0)
            return {
                mes: format(mes, 'MMM', { locale: ptBR }),
                total,
                fixos: gastosDoMes.filter(g => g.tipo === 'fixo').reduce((acc, g) => acc + g.valor, 0),
                variaveis: gastosDoMes.filter(g => g.tipo === 'variavel').reduce((acc, g) => acc + g.valor, 0)
            }
        })
    }, [gastos])

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <HeaderLayout moduleName="Controle de Gastos" description="Gerencie suas despesas e mantenha o controle financeiro" />
                <OutgoingForm onAdicionarGasto={adicionarGasto} />
            </div>

            {/* Métricas Resumo */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
                <Tabs defaultValue="lista" className="w-full flex flex-col gap-7">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="lista">Lista de Gastos</TabsTrigger>
                        <TabsTrigger value="graficos">Gráficos</TabsTrigger>
                        <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
                        <TabsTrigger value="orcamento">Orçamento</TabsTrigger>
                    </TabsList>

                    <TabsContent value="lista" className="space-y-4">
                        <OutgoingList 
                            gastos={gastos}
                        />
                    </TabsContent>
                    <TabsContent value="graficos" className="space-y-4">
                        <OutgoingCharts 
                            gastos={gastos}
                            gastosPorCategoria={gastosPorCategoria}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
