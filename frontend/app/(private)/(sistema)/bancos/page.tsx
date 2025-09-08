"use client"

import BankList from "@/components/Banks/BankList"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { 
  DollarSign, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  PiggyBank, 
  Building2, 
  Newspaper, 
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
  // {
  //   title: "Entradas",
  //   value: "R$ 45.000,00",
  //   icon: ArrowUpCircle,
  //   bg: "bg-[#ECFDF5]",
  //   color: "text-[#047857]",
  // },
  // {
  //   title: "Saídas",
  //   value: "R$ 20.000,00",
  //   icon: ArrowDownCircle,
  //   bg: "bg-[#FEF2F2]",
  //   color: "text-[#B91C1C]",
  // },
  // {
  //   title: "Investimentos",
  //   value: "R$ 35.000,00",
  //   icon: PiggyBank,
  //   bg: "bg-[#EFF6FF]",
  //   color: "text-[#1E40AF]",
  // },
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
  // {
  //   title: "CDI Hoje",
  //   value: "13,65%",
  //   icon: LineChart,
  //   bg: "bg-[#F0F9FF]",
  //   color: "text-[#0369A1]",
  // },
]

const noticias = [
  { banco: "Banco do Brasil", titulo: "Lucro líquido cresce 12% em 2025" },
  { banco: "Itaú", titulo: "Expansão digital atrai 1 milhão de clientes" },
  { banco: "Bradesco", titulo: "Revisão de tarifas prevista para o próximo trimestre" },
]

export default function BancosPage() {
  return (
    <div className="flex flex-col gap-6">
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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
                    <div className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {/* Notícias */}
      <Card className="gap-2 h-full">
        <CardHeader>
          {/* <div className="flex items-center gap-2"> */}
            {/* <Newspaper className="w-5 h-5 text-[#334155]" /> */}
            <CardTitle>Notícias dos Bancos</CardTitle>
          {/* </div> */}
        </CardHeader>
        <CardContent>
          <hr className="mb-4 border-gray-200" />
          <ul className="space-y-2">
            {noticias.map((n, i) => (
              <li key={i} className="flex flex-col border-b pb-2">
                <span className="text-sm font-semibold text-[#0F172A]">{n.banco}</span>
                <span className="text-sm text-[#475569]">{n.titulo}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Lista de bancos cadastrados */}
      <BankList/>
    </div>
  )
}
