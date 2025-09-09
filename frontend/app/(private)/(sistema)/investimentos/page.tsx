"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import { TopStocksCard } from "@/components/Stocks/topStocks"
import { GoalsCard } from "@/components/Goals/GoalsCard"

import {
    TrendingUp,
    PieChart,
    Target,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    DollarSign,
    Plus,
    TrendingDown,
    Eye
} from "lucide-react"
import { BankNews } from "@/components/Banks/BankNews"

const metrics = [
    {
        title: "Carteira Total",
        value: "R$ 85.420,00",
        icon: Wallet,
        bg: "bg-[#F0FDF4]",
        color: "text-[#166534]",
    },
    {
        title: "Rentabilidade Mensal",
        value: "+ 8.5%",
        icon: TrendingUp,
        bg: "bg-[#F0F9FF]",
        color: "text-[#0369A1]",
    },
    {
        title: "Diversificação",
        value: "12 Ativos",
        icon: PieChart,
        bg: "bg-[#F5F3FF]",
        color: "text-[#6D28D9]",
    },
    {
        title: "Meta Anual",
        value: "R$ 100.000",
        indicator: "85.4",
        icon: Target,
        bg: "bg-[#FFF7ED]",
        color: "text-[#C2410C]",
    },
]

const recentMovements = [
    {
        asset: "PETR4",
        type: "Compra",
        quantity: 100,
        price: "R$ 32,45",
        total: "R$ 3.245,00",
        date: "Hoje",
        isPositive: false
    },
    {
        asset: "VALE3",
        type: "Venda",
        quantity: 50,
        price: "R$ 68,20",
        total: "R$ 3.410,00",
        date: "Ontem",
        isPositive: true
    },
    {
        asset: "ITUB4",
        type: "Dividendo",
        quantity: 200,
        price: "R$ 0,15",
        total: "R$ 30,00",
        date: "2 dias",
        isPositive: true
    },
    {
        asset: "BBDC4",
        type: "Compra",
        quantity: 80,
        price: "R$ 15,80",
        total: "R$ 1.264,00",
        date: "3 dias",
        isPositive: false
    }
]

const sectorAllocation = [
    { sector: "Financeiro", percentage: 35, value: "R$ 29.897,00", color: "#6B21A8" },
    { sector: "Petróleo", percentage: 25, value: "R$ 21.355,00", color: "#7E22CE" },
    { sector: "Mineração", percentage: 20, value: "R$ 17.084,00", color: "#A855F7" },
    { sector: "Tecnologia", percentage: 15, value: "R$ 12.813,00", color: "#E9D5FF" },
    { sector: "Outros", percentage: 5, value: "R$ 4.271,00", color: "#9333EA" }
]

const priceAlerts = [
    { asset: "PETR4", currentPrice: "R$ 32,45", targetPrice: "R$ 35,00", type: "alta", status: "ativo" },
    { asset: "VALE3", currentPrice: "R$ 68,20", targetPrice: "R$ 65,00", type: "baixa", status: "ativo" },
    { asset: "ITUB4", currentPrice: "R$ 28,90", targetPrice: "R$ 30,00", type: "alta", status: "pausado" }
]

function MetricCard({ metric }: { metric: typeof metrics[0] }) {
    const Icon = metric.icon
    return (
        <Card className="h-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${metric.bg}`}>
                        <Icon className={`w-6 h-6 ${metric.color}`} />
                    </div>
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${metric.color} mb-1`}>
                            {metric.title}
                        </p>
                        <p className={`text-2xl font-bold ${metric.color}`}>
                            {metric.value}
                        </p>
                        {metric.indicator && (
                            <div className="mt-2">
                                <Progress value={parseFloat(metric.indicator)} className="h-2" />
                                <p className="text-xs text-gray-500 mt-1">{metric.indicator}% da meta</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardHeader>
        </Card>
    )
}

export default function InvestimentosPage() {
    return (
        <div className="flex flex-col gap-7">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
                {metrics.map((metric, index) => {
                    const Icon = metric.icon
                    return (
                        <Card key={index} className="gap-2 h-full">
                            <CardHeader>
                                <div className="flex items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${metric.bg}`}>
                                        <Icon className={`w-6 h-6 ${metric.color}`} />
                                    </div>
                                    <div className="ml-3">
                                        <div className={`text-sm font-medium ${metric.color}`}>
                                            {metric.title}
                                        </div>
                                        <div className={`text-2xl font-bold ${metric.color} flex gap-1 items-start`}>
                                            {metric.value}
                                            {metric.indicator !== undefined && (
                                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium text-pruple-700`}>
                                                    {Math.abs(metric.indicator).toFixed(1)}%
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                <Card className="gap-2 h-full">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                Alertas de Preços
                            </CardTitle>
                            <Button variant="outline" size="sm" className="hover:bg-blue-50">
                                <Plus className="w-4 h-4" />
                                Novo Alerta
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <hr className="mb-4 border-gray-200" />
                        <div className="space-y-4">
                            {priceAlerts.map((alert, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${alert.status === 'ativo' ? 'bg-purple-500 animate-pulse' : 'bg-gray-400'
                                            }`}></div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{alert.asset}</div>
                                            <div className="text-sm text-gray-500">
                                                {alert.currentPrice} → {alert.targetPrice}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={alert.type === 'alta' ? 'default' : 'secondary'} className="text-xs">
                                            {alert.type === 'alta' ? (
                                                <TrendingUp className="w-3 h-3 mr-1" />
                                            ) : (
                                                <TrendingDown className="w-3 h-3 mr-1" />
                                            )}
                                            {alert.type}
                                        </Badge>
                                        <Badge variant={alert.status === 'ativo' ? 'default' : 'outline'} className="text-xs">
                                            {alert.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="gap-2 h-full">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                Resumo do Mercado
                            </CardTitle>
                            <Button variant="outline" size="sm" className="hover:bg-green-50">
                                Atualizar
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <hr className="mb-4 border-gray-200" />
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col p-3 rounded-lg border shadow-sm hover:shadow-lg transition">
                                <span className="text-xs text-gray-500">Maior Alta</span>
                                <span className="font-semibold text-green-600 flex items-center gap-1">
                                    <TrendingUp className="w-4 h-4" /> PETR4 +4.2%
                                </span>
                            </div>

                            <div className="flex flex-col p-3 rounded-lg border shadow-sm hover:shadow-lg transition">
                                <span className="text-xs text-gray-500">Maior Queda</span>
                                <span className="font-semibold text-red-600 flex items-center gap-1">
                                    <TrendingDown className="w-4 h-4" /> VALE3 -3.8%
                                </span>
                            </div>

                            <div className="flex flex-col p-3 rounded-lg border shadow-sm hover:shadow-lg transition">
                                <span className="text-xs text-gray-500">Setor em Alta</span>
                                <span className="font-semibold text-gray-800">Energia</span>
                            </div>

                            <div className="flex flex-col p-3 rounded-lg border shadow-sm hover:shadow-lg transition">
                                <span className="text-xs text-gray-500">Volatilidade</span>
                                <span className="font-semibold text-gray-800">Alta</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                <TopStocksCard />

                <div className="col-span-2">
                    <BankNews />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                <Card className="gap-2 h-full">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Distribuição por Setor</CardTitle>
                            <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalhes
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <hr className="mb-4 border-gray-200" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                            {sectorAllocation.map((sector, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className='w-3 h-3 rounded-full'
                                                style={{ backgroundColor: sector.color }}
                                                aria-label={`Cor representando o setor ${sector.sector}`}
                                            ></span>
                                            <span className="font-semibold text-gray-800 text-lg">{sector.sector}</span>
                                        </div>
                                        <div className="text-right flex gap-2">
                                            <DollarSign className="h-5 e-5 text-gray-500" />
                                            <div className="font-bold text-gray-900">{sector.value}</div>
                                        </div>
                                    </div>

                                    <div className="relative mb-3">
                                        <Progress
                                            color={sector.color}
                                            value={sector.percentage}
                                            className="h-5 rounded-full bg-gray-100"
                                        />
                                        <span className="absolute right-2 top-0 text-sm font-medium text-gray-700">
                                            {sector.percentage}%
                                        </span>
                                    </div>

                                    {/* Valor do setor */}
                                </div>
                            ))}
                        </div>
                    </CardContent>

                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-7">
                    <Card className="gap-2 h-full">
                        <CardHeader>
                            <CardTitle>
                                Calculadora de Rendimentos
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <hr className="mb-4 border-gray-200" />
                            <div className="space-y-7">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Valor do Investimento</label>
                                    <Input placeholder="R$ 10.000,00" className="focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Taxa de Juros (% a.a.)</label>
                                    <Input placeholder="12,5" className="focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Período (meses)</label>
                                    <Input placeholder="12" className="focus:ring-2 focus:ring-purple-500" />
                                </div>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                    Calcular Rendimento
                                </Button>
                                <div className="bg-gradient-to-r from-purple-50 to-purple-50 p-4 rounded-lg border border-purple-200">
                                    <div className="text-sm text-gray-600 mb-1">Valor Final Estimado</div>
                                    <div className="text-2xl font-bold text-purple-600 mb-1">R$ 11.250,00</div>
                                    <div className="text-sm text-gray-600">Rendimento: <span className="font-semibold text-purple-600">R$ 1.250,00</span></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <GoalsCard />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                <Card className="gap-2 h-full col-span-2">
                    <CardHeader>
                        <CardTitle>Movimentações Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <hr className="mb-4 border-gray-200" />
                        <div className="space-y-3">
                            {recentMovements.map((movement, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg border shadow-sm hover:shadow-lg transition-all duration-200">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${movement.isPositive ? 'bg-green-100 border-2 border-green-200' : 'bg-red-100 border-2 border-red-200'
                                            }`}>
                                            {movement.isPositive ? (
                                                <ArrowUpRight className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <ArrowDownRight className="w-5 h-5 text-red-600" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-lg">{movement.asset}</div>
                                            <div className="text-sm text-gray-500">
                                                {movement.type} • {movement.quantity} ações
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-bold text-lg ${movement.isPositive ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {movement.isPositive ? '+' : '-'} {movement.total}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {movement.price} • {movement.date}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="gap-2 h-full">
                    <CardHeader>
                        <CardTitle>Sugestão da IA</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <hr className="mb-4 border-gray-200" />
                        <div className="space-y-3">
                            Sugestão da IA aqui
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
