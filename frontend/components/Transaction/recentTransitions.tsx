"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowDown, ArrowUp } from "lucide-react"

interface Transaction {
  id: string
  tipo: "entrada" | "saida"
  descricao: string
  valor: number
  data: string
}

const transactions: Transaction[] = [
  {
    id: "1",
    tipo: "entrada",
    descricao: "Pagamento Cliente A",
    valor: 2500,
    data: "26/06/2025"
  },
  {
    id: "2",
    tipo: "saida",
    descricao: "Assinatura AWS",
    valor: 500,
    data: "25/06/2025"
  },
  {
    id: "3",
    tipo: "entrada",
    descricao: "Recebimento Boleto",
    valor: 1750,
    data: "24/06/2025"
  },
  {
    id: "4",
    tipo: "saida",
    descricao: "Compra de Equipamento",
    valor: 1300,
    data: "23/06/2025"
  },
  {
    id: "5",
    tipo: "entrada",
    descricao: "Pagamento Cliente B",
    valor: 3000,
    data: "22/06/2025"
  },
  {
    id: "6",
    tipo: "saida",
    descricao: "Compra de Equipamento",
    valor: 2000,
    data: "21/06/2025"
  },
  {
    id: "7",
    tipo: "saida",
    descricao: "Compra de Equipamento",
    valor: 2000,
    data: "21/06/2025"
  },
  {
    id: "8",
    tipo: "saida",
    descricao: "Compra de Equipamento",
    valor: 2000,
    data: "21/06/2025"
  },
  {
    id: "9",
    tipo: "saida",
    descricao: "Compra de Equipamento",
    valor: 2000,
    data: "21/06/2025"
  },
]

export function RecentTransactions() {
  return (
    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
      {transactions.map((tx) => (
        <Card key={tx.id} className='p-3'>
          <CardContent className="flex items-center justify-between p-0">
            <div className="flex items-center gap-3">
              {tx.tipo === "entrada" ? (
                <ArrowUp className="text-green-600 w-5 h-5" />
              ) : (
                <ArrowDown className="text-red-600 w-5 h-5" />
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">{tx.descricao}</span>
                <span className="text-xs text-muted-foreground">{tx.data}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={tx.tipo === "entrada" ? "success" : "destructive"}>
                {tx.tipo === "entrada" ? "Entrada" : "Saída"}
              </Badge>
              <span
                className={`text-sm font-semibold ${
                  tx.tipo === "entrada" ? "text-green-600" : "text-red-600"
                }`}
              >
                {tx.tipo === "entrada" ? "+" : "-"} R$ {tx.valor.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
