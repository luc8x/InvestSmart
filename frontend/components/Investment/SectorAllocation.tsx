"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

import {
    DollarSign,
    Eye
} from "lucide-react"

export function SectorAllocation() {

    const sectorAllocation = [
        { sector: "Financeiro", percentage: 35, value: "R$ 29.897,00", color: "#6B21A8" },
        { sector: "Petróleo", percentage: 25, value: "R$ 21.355,00", color: "#7E22CE" },
        { sector: "Mineração", percentage: 20, value: "R$ 17.084,00", color: "#A855F7" },
        { sector: "Tecnologia", percentage: 15, value: "R$ 12.813,00", color: "#E9D5FF" },
        { sector: "Outros", percentage: 5, value: "R$ 4.271,00", color: "#9333EA" }
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
                <hr className="mb-4 border-gray-200" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                    {sectorAllocation.map((sector, index) => (
                        <div
                            key={index}
                            className="flex flex-col p-4 rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <span
                                        className='w-3 h-3 rounded-full'
                                        style={{ backgroundColor: sector.color }}
                                        aria-label={`Cor representando o setor ${sector.sector}`}
                                    ></span>
                                    <span className="font-semibold text-gray-800 text-lg">{sector.sector}</span>
                                </div>
                                <div className="text-right flex gap-2 items-center">
                                    <DollarSign size={15} className="text-gray-500" />
                                    <div className="font-bold text-gray-900">{sector.value}</div>
                                </div>
                            </div>

                            <div className="relative mb-3">
                                <Progress
                                    color={sector.color}
                                    value={sector.percentage}
                                    className="h-5 rounded-full bg-gray-100"
                                />
                                <span className="absolute right-2 top-0 text-sm font-medium text-gray-700">
                                    {sector.percentage}%
                                </span>
                            </div>

                            {/* Valor do setor */}
                        </div>
                    ))}
                </div>
            </CardContent>

        </Card>
    )
}