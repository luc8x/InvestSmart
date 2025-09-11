"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Filter, Search, TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react"
import { CardInfo } from "@/components/LayoutBase/CardInfo"
import { format, startOfMonth, endOfMonth, subMonths, isSameMonth } from "date-fns"
import { ptBR } from "date-fns/locale"
import { HeaderLayout } from "@/components/LayoutBase/HeaderPage"
import { 
  GastoForm, 
  GastosList, 
  GastosCharts, 
  InsightsCard, 
  Gasto, 
  CATEGORIAS 
} from "@/components/Outgoing"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function GastosPage() {
    const [gastos, setGastos] = useState<Gasto[]>([])
    const [filtroCategoria, setFiltroCategoria] = useState('todas')
    const [filtroMes, setFiltroMes] = useState(new Date().getMonth())
    const [filtroAno, setFiltroAno] = useState(new Date().getFullYear())
    const [busca, setBusca] = useState('')
    const [insightsAtivos, setInsightsAtivos] = useState(true)
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

    const carregarMaisGastos = () => {
        setGastosVisiveis(prev => prev + 20)
    }

    // Filtros otimizados
    const gastosFiltrados = useMemo(() => {
        return gastos.filter(gasto => {
            const mesGasto = gasto.data.getMonth()
            const anoGasto = gasto.data.getFullYear()
            const categoriaMatch = filtroCategoria === 'todas' || gasto.categoria === filtroCategoria
            const dataMatch = mesGasto === filtroMes && anoGasto === filtroAno
            const buscaMatch = gasto.descricao.toLowerCase().includes(busca.toLowerCase()) ||
                              gasto.categoria.toLowerCase().includes(busca.toLowerCase())
            
            return categoriaMatch && dataMatch && buscaMatch
        })
    }, [gastos, filtroCategoria, filtroMes, filtroAno, busca])

    // Cálculos otimizados
    const { totalGastos, gastosPorCategoria, gastosFixos, gastosVariaveis } = useMemo(() => {
        const total = gastosFiltrados.reduce((acc, gasto) => acc + gasto.valor, 0)
        
        const categorias = CATEGORIAS.map(categoria => {
            const gastosCategoria = gastosFiltrados.filter(gasto => gasto.categoria === categoria.nome)
            const totalCategoria = gastosCategoria.reduce((acc, gasto) => acc + gasto.valor, 0)
            return {
                ...categoria,
                total: totalCategoria,
                gastos: gastosCategoria.length,
                percentual: total > 0 ? (totalCategoria / total) * 100 : 0
            }
        }).filter(categoria => categoria.total > 0)

        const fixos = gastosFiltrados.filter(gasto => gasto.tipo === 'fixo').reduce((acc, gasto) => acc + gasto.valor, 0)
        const variaveis = gastosFiltrados.filter(gasto => gasto.tipo === 'variavel').reduce((acc, gasto) => acc + gasto.valor, 0)
        
        return {
            totalGastos: total,
            gastosPorCategoria: categorias,
            gastosFixos: fixos,
            gastosVariaveis: variaveis
        }
    }, [gastosFiltrados])

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

    // Gastos com infinite scroll
    const gastosComScroll = gastosFiltrados.slice(0, gastosVisiveis)

    return (
        <div className="flex flex-col gap-6 p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <HeaderLayout moduleName="Controle de Gastos" description="Gerencie suas despesas e mantenha o controle financeiro" />
                <GastoForm onAdicionarGasto={adicionarGasto} />
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
                        indicator: `${gastosFiltrados.length} transações`
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

            {/* Card de Insights Inteligentes */}
            <InsightsCard 
                gastos={gastos}
                gastosFiltrados={gastosFiltrados}
                gastosPorCategoria={gastosPorCategoria}
                totalGastos={totalGastos}
                insightsAtivos={insightsAtivos}
                onToggleInsights={setInsightsAtivos}
            />

            <Tabs defaultValue="lista" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="lista">Lista de Gastos</TabsTrigger>
                    <TabsTrigger value="graficos">Gráficos</TabsTrigger>
                    <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
                    <TabsTrigger value="orcamento">Orçamento</TabsTrigger>
                </TabsList>

                <TabsContent value="lista" className="space-y-4">
                    <GastosList 
                        gastos={gastosFiltrados}
                        onRemoverGasto={removerGasto}
                        filtros={{
                            categoria: filtroCategoria,
                            mes: filtroMes,
                            ano: filtroAno,
                            busca: busca
                        }}
                        onFiltrosChange={{
                            setCategoria: setFiltroCategoria,
                            setMes: setFiltroMes,
                            setAno: setFiltroAno,
                            setBusca: setBusca
                        }}
                        gastosVisiveis={gastosVisiveis}
                        onCarregarMais={carregarMaisGastos}
                    />
                </TabsContent>

                <TabsContent value="graficos" className="space-y-4">
                    <GastosCharts 
                        gastos={gastos}
                        gastosFiltrados={gastosFiltrados}
                        gastosPorCategoria={gastosPorCategoria}
                    />
                </TabsContent>

                <TabsContent value="categorias" className="space-y-4">
                    <Card className="gap-2">
                        <CardHeader>
                            <CardTitle>Gastos por Categoria</CardTitle>
                            <CardDescription>Distribuição dos seus gastos por categoria</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <hr className="mb-4 border-gray-200" />
                            <div className="space-y-4">
                                {gastosPorCategoria.map(categoria => (
                                    <div key={categoria.nome} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded ${categoria.cor}`} />
                                                <span className="font-medium">{categoria.icone} {categoria.nome}</span>
                                                <Badge variant="outline">{categoria.gastos} gastos</Badge>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    R$ {categoria.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {categoria.percentual.toFixed(1)}%
                                                </p>
                                            </div>
                                        </div>
                                        <Progress value={categoria.percentual} className="h-2" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="orcamento" className="space-y-4">
                    <Card className="gap-2">
                        <CardHeader>
                            <CardTitle>Controle de Orçamento</CardTitle>
                            <CardDescription>Acompanhe seus gastos em relação ao orçamento planejado</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <hr className="mb-4 border-gray-200" />
                            <div className="space-y-6">
                                {CATEGORIAS.filter(cat => cat.orcamento).map(categoria => {
                                    const gastoCategoria = gastosPorCategoria.find(g => g.nome === categoria.nome)
                                    const gasto = gastoCategoria?.total || 0
                                    const orcamento = categoria.orcamento || 0
                                    const percentual = orcamento > 0 ? (gasto / orcamento) * 100 : 0
                                    const status = percentual > 100 ? 'danger' : percentual > 80 ? 'warning' : 'success'
                                    
                                    return (
                                        <div key={categoria.nome} className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg">{categoria.icone}</span>
                                                    <span className="font-medium">{categoria.nome}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold">
                                                        R$ {gasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} / 
                                                        R$ {orcamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </p>
                                                    <p className={`text-sm ${
                                                        status === 'danger' ? 'text-red-500' :
                                                        status === 'warning' ? 'text-yellow-500' :
                                                        'text-green-500'
                                                    }`}>
                                                        {percentual.toFixed(1)}% utilizado
                                                    </p>
                                                </div>
                                            </div>
                                            <Progress 
                                                value={Math.min(percentual, 100)} 
                                                className={`h-3 ${
                                                    status === 'danger' ? '[&>div]:bg-red-500' :
                                                    status === 'warning' ? '[&>div]:bg-yellow-500' :
                                                    '[&>div]:bg-green-500'
                                                }`}
                                            />
                                            {percentual > 100 && (
                                                <Alert className="border-red-200 bg-red-50">
                                                    <AlertDescription className="text-red-700">
                                                        Orçamento excedido em R$ {(gasto - orcamento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
