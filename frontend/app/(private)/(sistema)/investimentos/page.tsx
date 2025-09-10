"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { TopStocksCard } from "@/components/Stocks/topStocks"
import { GoalsCard } from "@/components/Goals/GoalsCard"

import { TrendingUp, PieChart, Target, Wallet } from "lucide-react"
import { BankNews } from "@/components/NewsFinance/News"
import { MarketSummary } from "@/components/Investment/MarketSummary"
import { PriceAlerts } from "@/components/Investment/PriceAlerts"
import { IncomeCalculator } from "@/components/Investment/IncomeCalculator"
import { SectorAllocation } from "@/components/Investment/SectorAllocation"
import { RecentMovements } from "@/components/Investment/RecentMovements"
import { PortfolioChart } from "@/components/Investment/PortfolioChart"

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
        title: "Meta Total",
        value: "R$ 100.000",
        indicator: "85.4",
        icon: Target,
        bg: "bg-[#FFF7ED]",
        color: "text-[#C2410C]",
    },
]

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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-7">
                <div className="col-span-3">
                    <PortfolioChart />
                </div>
                <RecentMovements />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                <PriceAlerts />
                <MarketSummary />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                <TopStocksCard />

                <div className="col-span-2">
                    <BankNews />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
                <SectorAllocation />

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-7">
                    <GoalsCard />
                    <IncomeCalculator />
                </div>
            </div>
        </div>
    )
}
