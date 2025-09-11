"use client"

import { Card, CardHeader } from "@/components/ui/card"
import { TrendingUp, PieChart, Target, Wallet } from "lucide-react"
import { TopStocksCard } from "@/components/Stocks/topStocks"
import { GoalsCard } from "@/components/Goals/GoalsCard"
import { BankNews } from "@/components/NewsFinance/News"
import { MarketSummary } from "@/components/Investment/MarketSummary"
import { PriceAlerts } from "@/components/Investment/PriceAlerts"
import { IncomeCalculator } from "@/components/Investment/IncomeCalculator"
import { SectorAllocation } from "@/components/Investment/SectorAllocation"
import { RecentMovements } from "@/components/Investment/RecentMovements"
import { PortfolioChart } from "@/components/Investment/PortfolioChart"
import { HeaderLayout } from "@/components/LayoutBase/HeaderPage"
import { CardInfo } from "@/components/LayoutBase/CardInfo"

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
        <div className="flex flex-col gap-7 p-6">
            <HeaderLayout moduleName="Investimentos" description="Gerencie seus investimentos e mantenha o controle financeiro" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
                <CardInfo metrics={metrics} />
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
