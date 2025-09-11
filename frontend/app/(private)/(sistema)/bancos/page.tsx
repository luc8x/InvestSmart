"use client"

import BankList from "@/components/Banks/BankList"
import { BankTop5 } from "@/components/Banks/BankTop5"
import { CardInfo } from "@/components/LayoutBase/CardInfo"
import { HeaderLayout } from "@/components/LayoutBase/HeaderPage"
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
    <div className="flex flex-col gap-7 p-6">
      <HeaderLayout moduleName="Bancos" description="Gerencie seus bancos e mantenha o controle financeiro" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7">
        <CardInfo metrics={metrics} />
      </div>
      <div className="grid grid-cols-2 gap-7">
        <BankTop5 />
        <BankNews />
      </div>
      <BankList />
    </div>
  )
}
