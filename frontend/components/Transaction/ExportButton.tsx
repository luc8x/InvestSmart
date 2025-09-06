"use client"

import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ExportButtonProps {
  data:  {
    dia: string
    entrada: number
    saida: number
  }[]
  period: string
}

export function ExportButton({ data, period }: ExportButtonProps) {
  const exportToCSV = () => {
    const headers = ['Data', 'Entradas (R$)', 'Saídas (R$)', 'Saldo (R$)']
    const csvContent = [
      headers.join(','),
      ...data.map(item => {
        const balance = item.entrada - item.saida
        return [
          item.dia,
          item.entrada.toFixed(2),
          item.saida.toFixed(2),
          balance.toFixed(2)
        ].join(',')
      })
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `fluxo-caixa-${period.toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={exportToCSV}
      className="flex items-center gap-2"
    >
      <Download size={16} />
      Exportar CSV
    </Button>
  )
}