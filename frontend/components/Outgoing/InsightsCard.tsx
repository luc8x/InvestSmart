"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Zap, AlertTriangle, Lightbulb } from "lucide-react"
import { subMonths, isSameMonth } from "date-fns"
import { Gasto, InsightData, CATEGORIAS } from "./types"

interface InsightsCardProps {
  gastos: Gasto[]
  insightsAtivos: boolean
  onToggleInsights: (ativo: boolean) => void
}

export function InsightsCard({ gastos, insightsAtivos, onToggleInsights }: InsightsCardProps) {
  const analisarInsights = useMemo(() => {
    if (!insightsAtivos || gastos.length < 3) return []
    
    const insights: InsightData[] = []
    const agora = new Date()
    const ultimosMeses = Array.from({ length: 3 }, (_, i) => subMonths(agora, i))
    
    // Calcular médias por categoria
    const mediasPorCategoria = CATEGORIAS.map(categoria => {
      const gastosCategoria = gastos.filter(g => g.categoria === categoria.nome)
      const gastosPorMes = ultimosMeses.map(mes => {
        const gastosDoMes = gastosCategoria.filter(g => isSameMonth(g.data, mes))
        return gastosDoMes.reduce((acc, g) => acc + g.valor, 0)
      })
      const media = gastosPorMes.reduce((acc, val) => acc + val, 0) / gastosPorMes.length
      return { categoria: categoria.nome, media, atual: gastosPorMes[0] }
    })
    
    // Alertas de gastos acima da média
    mediasPorCategoria.forEach(({ categoria, media, atual }) => {
      if (atual > media * 1.3 && media > 0) {
        insights.push({
          tipo: 'alerta',
          titulo: `Gasto elevado em ${categoria}`,
          descricao: `Você gastou R$ ${atual.toFixed(2)} este mês, ${((atual/media - 1) * 100).toFixed(0)}% acima da média.`,
          icone: AlertTriangle,
          cor: 'text-red-600'
        })
      }
    })
    
    // Sugestões de economia para assinaturas
    const assinaturas = gastos.filter(g => 
      g.descricao.toLowerCase().includes('netflix') ||
      g.descricao.toLowerCase().includes('spotify') ||
      g.descricao.toLowerCase().includes('disney') ||
      g.descricao.toLowerCase().includes('amazon prime') ||
      g.descricao.toLowerCase().includes('youtube premium')
    )
    
    if (assinaturas.length >= 2) {
      const totalAssinaturas = assinaturas.reduce((acc, g) => acc + g.valor, 0)
      insights.push({
        tipo: 'economia',
        titulo: 'Oportunidade de economia',
        descricao: `Suas assinaturas somam R$ ${totalAssinaturas.toFixed(2)}/mês. Considere revisar quais realmente usa.`,
        icone: Lightbulb,
        cor: 'text-yellow-600'
      })
    }
    
    return insights
  }, [gastos, insightsAtivos])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <CardTitle>Insights Inteligentes</CardTitle>
        </div>
        <Switch 
          checked={insightsAtivos} 
          onCheckedChange={onToggleInsights}
        />
      </CardHeader>
      <CardContent>
        {insightsAtivos && analisarInsights.length > 0 ? (
          <div className="space-y-3">
            {analisarInsights.map((insight, index) => {
              const Icon = insight.icone
              return (
                <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                  <Icon className={`h-5 w-5 mt-0.5 ${insight.cor}`} />
                  <div className="flex-1">
                    <h4 className="font-medium">{insight.titulo}</h4>
                    <p className="text-sm text-muted-foreground">{insight.descricao}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {insightsAtivos ? 'Adicione mais gastos para receber insights personalizados.' : 'Insights desativados'}
          </p>
        )}
      </CardContent>
    </Card>
  )
}