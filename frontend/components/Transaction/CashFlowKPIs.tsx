"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

interface CashFlowData {
  dia: string
  entrada: number
  saida: number
}

export function CashFlowKPIs({ data, previousData }: {data: CashFlowData[], previousData?: CashFlowData[]}) {
  const currentBalance = data.reduce((acc, item) => acc + item.entrada - item.saida, 0)
  const previousBalance = previousData ? previousData.reduce((acc, item) => acc + item.entrada - item.saida, 0) : 0
  
  const variation = previousBalance !== 0 ? ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100 : 0
  const isPositive = variation >= 0
  
  return (
    <div className="flex gap-6 items-center">
      <div className="flex flex-col">
        <span className="text-sm text-muted-foreground">Saldo Líquido</span>
        <span className={`text-2xl font-bold ${
          currentBalance >= 0 ? 'text-green-600' : 'text-red-500'
        }`}>
          R$ {Math.abs(currentBalance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </span>
      </div>
      
      {previousData && (
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${
            isPositive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {isPositive ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {Math.abs(variation).toFixed(1)}%
          </div>
          <span className="text-xs text-muted-foreground">
            vs período anterior
          </span>
        </div>
      )}
    </div>
  )
}