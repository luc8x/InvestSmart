"use client"

import { ArrowUp, ArrowDown } from "lucide-react"

interface TopTransactionsProps {
  data: {
    dia: string
    entrada: number
    saida: number
  }[]
}

export function TopTransactions({ data }: TopTransactionsProps) {
  const topEntries = [...data]
    .sort((a, b) => b.entrada - a.entrada)
    .slice(0, 3)
    .filter(item => item.entrada > 0)
  
  const topExits = [...data]
    .sort((a, b) => b.saida - a.saida)
    .slice(0, 3)
    .filter(item => item.saida > 0)
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <ArrowUp size={16} className="text-green-600" />
          Maiores Entradas
        </h4>
        <div className="space-y-2">
          {topEntries.length > 0 ? (
            topEntries.map((item, index) => (
              <div key={`entry-${index}`} className="flex justify-between items-center py-2 px-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium">{item.dia}</span>
                <span className="text-sm font-bold text-green-600">
                  R$ {item.entrada.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma entrada no período</p>
          )}
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <ArrowDown size={16} className="text-red-500" />
          Maiores Saídas
        </h4>
        <div className="space-y-2">
          {topExits.length > 0 ? (
            topExits.map((item, index) => (
              <div key={`exit-${index}`} className="flex justify-between items-center py-2 px-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium">{item.dia}</span>
                <span className="text-sm font-bold text-red-500">
                  R$ {item.saida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma saída no período</p>
          )}
        </div>
      </div>
    </div>
  )
}