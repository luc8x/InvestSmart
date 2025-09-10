"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Eye, Bitcoin, PieChart, Landmark, Banknote, LineChart } from "lucide-react"

export function SectorAllocation() {

    const sectorAllocation = [
        { sector: "Fundos de Investimento", percentage: 40, value: "R$ 34.168,00", color: "#10B981", icon: <PieChart className="w-5 h-5 text-purple-600" /> },
        { sector: "Tesouro Direto", percentage: 25, value: "R$ 21.355,00", color: "#3B82F6", icon: <Landmark className="w-5 h-5 text-purple-600" /> },
        { sector: "CDI/CDB", percentage: 20, value: "R$ 17.084,00", color: "#F59E0B", icon: <Banknote className="w-5 h-5 text-purple-600" /> },
        { sector: "Criptomoedas", percentage: 10, value: "R$ 8.542,00", color: "#8B5CF6", icon: <Bitcoin className="w-5 h-5 text-purple-600" /> },
        { sector: "Outros", percentage: 5, value: "R$ 4.271,00", color: "#6B7280", icon: <LineChart className="w-5 h-5 text-purple-600" /> }
    ]

    return (
        <Card className="gap-2 h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Distribuição por Setor</CardTitle>
                    <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:text-purple-700">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                <hr className="mb-6 border-gray-200" />
                
                {/* Resumo Total */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-700 to-white rounded-lg border">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-white">Total Investido</p>
                            <p className="text-2xl font-bold text-white">R$ 85.420,00</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-600">Diversificação</p>
                            <p className="text-lg font-semibold text-purple-600">5 Categorias</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {sectorAllocation.map((sector, index) => (
                        <div
                            key={index}
                            className="group p-4 rounded-xl border border-gray-200 bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-200"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="flex items-center justify-center w-10 h-10 rounded-full"
                                        style={{ backgroundColor: `#9810FB20` }}
                                    >
                                        {sector.icon}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-800 text-base">{sector.sector}</span>
                                        <p className="text-sm text-gray-500">{sector.percentage}% da carteira</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-gray-900 text-lg">{sector.value}</div>
                                    <div className="text-sm font-medium text-purple-600">
                                        {sector.percentage}%
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div 
                                        className="h-2 rounded-full transition-all duration-500 group-hover:shadow-sm"
                                        style={{ 
                                            width: `${sector.percentage}%`, 
                                            backgroundColor: "#9810FB"
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

        </Card>
    )
}