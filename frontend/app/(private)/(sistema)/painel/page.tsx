"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUp, BarChart, CreditCard, DollarSign, Search, TrendingUp } from "lucide-react"
import { InfoValue } from "@/components/InfoMetrics/InfoValue"
import { CashFlowChart } from "@/components/Transaction/CashFlowChart"
import { RecentTransactions } from "@/components/Transaction/recentTransitions"
import { Input } from "@/components/ui/input"
import { TopStocksCard } from "@/components/Stocks/topStocks"
import { GoalsCard } from "@/components/Goals/GoalsCard"

export default function PainelPage() {

  return (
    <div className="grid gap-7 md:grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col gap-7">
        <div className="grid gap-7 md:grid-cols-1 lg:grid-cols-2">
          <InfoValue title="Saldo Atual" value="R$ 12.300,00" icon={<DollarSign size={24} className="text-gray-400" />} description="Atualizado hoje" delay={0.2} />
          <InfoValue title="Receitas" value="R$ 4.500,00" icon={<TrendingUp size={24} className="text-gray-400" />} description="Este mês" titleColor="text-green-600" delay={0.4} />
          <InfoValue title="Despesas" value="R$ 3.200,00" icon={<CreditCard size={24} className="text-gray-400" />} description="Este mês" titleColor="text-red-600" delay={0.6} />
          <InfoValue title="Lucro" value="R$ 1.300,00" icon={<BarChart size={24} className="text-gray-400" />} iconComparison={<ArrowUp size={24} className="text-green-600" />} description="Comparado ao mês anterior" titleColor="text-green-600" delay={0.8} />
        </div>
        <Card className="gap-2 h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Transações Recentes</CardTitle>
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="Procurar..."
                  className="pr-9 w-48 focus:w-56 border border-gray-200 backdrop-blur-sm rounded-full text-black placeholder:text-gray-900/60 focus:shadow-none focus:border-white/40 transition-all duration-300"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 group-hover:text-white/80 transition-colors duration-200" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <hr className=" mb-4 border-gray-200" />
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-7">
        <div>
          <CashFlowChart />
        </div>
        <div className="grid gap-7 md:grid-cols-1 lg:grid-cols-2">
          <Card className="gap-2 h-full">
            <CardHeader className="flex items-center justify-between">
              <CardTitle>Metas</CardTitle>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  2 metas ativas
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <hr className="mb-4 border-gray-200" />
              <div className="pr-2">
                <div className="grid gap-4">
                  <GoalsCard />
                  <GoalsCard />
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <Card className="gap-2 h-full">
              <CardHeader>
                <CardTitle>Investimentos</CardTitle>
              </CardHeader>
              <CardContent>
                <hr className="mb-4 border-gray-200" />
                <TopStocksCard />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
