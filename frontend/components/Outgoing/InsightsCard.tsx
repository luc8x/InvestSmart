"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  Lightbulb, 
  TrendingUp, 
  Target,
  Calendar,
  ChevronDown
} from "lucide-react"

interface InsightsCardProps {
  gastos?: any[]
  gastosFiltrados?: any[]
  gastosPorCategoria?: any[]
  totalGastos?: number
  insightsAtivos: boolean
  onToggleInsights: (ativo: boolean) => void
}

const mockInsights = [
  {
    id: 1,
    tipo: 'alerta',
    titulo: 'Gasto elevado em Alimentação',
    descricao: 'Você gastou R$ 1.250,00 este mês, 35% acima da sua média mensal.',
    icone: AlertTriangle,
    valor: 1250,
    variacao: '+35%',
    categoria: 'Alimentação'
  },
  {
    id: 2,
    tipo: 'economia',
    titulo: 'Oportunidade de economia',
    descricao: 'Suas assinaturas somam R$ 89,90/mês. Considere revisar quais realmente usa.',
    icone: Lightbulb,
    valor: 89.90,
    variacao: 'R$ 30 economia possível',
    categoria: 'Assinaturas'
  },
  {
    id: 3,
    tipo: 'meta',
    titulo: 'Meta de transporte atingida',
    descricao: 'Você conseguiu reduzir seus gastos com transporte em 20% este mês.',
    icone: Target,
    valor: 320,
    variacao: '-20%',
    categoria: 'Transporte'
  },
  {
    id: 4,
    tipo: 'tendencia',
    titulo: 'Tendência de crescimento',
    descricao: 'Seus gastos com entretenimento aumentaram 15% nos últimos 3 meses.',
    icone: TrendingUp,
    valor: 450,
    variacao: '+15%',
    categoria: 'Entretenimento'
  }
]

export function InsightsCard({ insightsAtivos, onToggleInsights }: InsightsCardProps) {
  const [insightsSelecionados] = useState(mockInsights)
  const [insightsRecolhidos, setInsightsRecolhidos] = useState(false)
  
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }
  


  return (
    <Card className="border-purple-100 shadow-sm gap-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-medium text-gray-900">
              Insights Inteligentes
            </CardTitle>
            <p className="text-sm text-gray-500 mt-1">
              Análises automáticas dos seus gastos
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setInsightsRecolhidos(!insightsRecolhidos)}
            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50/50 transition-all duration-200 px-3"
          >
            <div className={`transition-transform duration-300 ${insightsRecolhidos ? 'rotate-0' : 'rotate-180'}`}>
              <ChevronDown className="w-4 h-4 mr-2" />
            </div>
            {insightsRecolhidos ? 'Expandir' : 'Recolher'}
          </Button>
        </div>
      </CardHeader>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        insightsRecolhidos 
          ? 'max-h-0 opacity-0 transform -translate-y-2' 
          : 'max-h-[2000px] opacity-100 transform translate-y-0'
      }`}>
        <CardContent className="transition-all duration-300 pt-0">
          <div className="space-y-6">
            {insightsSelecionados.map((insight) => {
              const IconeInsight = insight.icone
              return (
                <div
                  key={insight.id}
                  className="p-4 rounded-lg border transition-all duration-200 hover:shadow-md bg-white"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-purple-50">
                      <IconeInsight className="w-4 h-4 text-purple-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">
                          {insight.titulo}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {insight.variacao}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {insight.descricao}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                          {insight.categoria}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {formatarMoeda(insight.valor)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}