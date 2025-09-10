"use client"

import BankList from "@/components/Banks/BankList"
import { BankTop5 } from "@/components/Banks/BankTop5"
import { BankNews } from "@/components/NewsFinance/News"
import { Card, CardHeader } from "@/components/ui/card"
import {
  DollarSign,
  Building2,
  CreditCard,
  LineChart
} from "lucide-react"

const metrics = [
  {
    title: "Saldo Total",
    value: "R$ 100.000,00",
    icon: DollarSign,
    bg: "bg-[#F0FDF4]",
    color: "text-[#166534]",
  },
  {
    title: "Limite Crédito Total",
    value: "R$ 15.000,00",
    icon: CreditCard,
    bg: "bg-[#FFF7ED]",
    color: "text-[#C2410C]",
  },
  {
    title: "Bancos Cadastrados",
    value: "5",
    icon: Building2,
    bg: "bg-[#F5F3FF]",
    color: "text-[#6D28D9]",
  },
  {
    title: "Melhor CDI do mercado",
    value: "Banco do Brasil",
    indicator: "13.8",
    icon: LineChart,
    bg: "bg-[#F0F9FF]",
    color: "text-[#0369A1]",
  },
]

export default function BancosPage() {
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
      <div className="grid grid-cols-2 gap-7">
        <BankTop5 />
        <BankNews />
      </div>
      <BankList />
    </div>
  )
}
