"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
    TrendingUp,
    TrendingDown,
} from "lucide-react"

export function MarketSummary() {
    return (
        <Card className="gap-2 h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>
                        Resumo do Mercado
                    </CardTitle>
                    <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:text-purple-700">
                        Atualizar
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <hr className="mb-4 border-gray-200" />
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col p-3 rounded-lg border shadow-sm hover:shadow-lg transition">
                        <span className="text-xs text-gray-500">Maior Alta</span>
                        <span className="font-semibold text-purple-600 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> PETR4 +4.2%
                        </span>
                    </div>

                    <div className="flex flex-col p-3 rounded-lg border shadow-sm hover:shadow-lg transition">
                        <span className="text-xs text-gray-500">Maior Queda</span>
                        <span className="font-semibold text-gray-800 flex items-center gap-1">
                            <TrendingDown className="w-4 h-4" /> VALE3 -3.8%
                        </span>
                    </div>

                    <div className="flex flex-col p-3 rounded-lg border shadow-sm hover:shadow-lg transition">
                        <span className="text-xs text-gray-500">Valor do Bitcoin</span>
                        <span className="font-semibold text-purple-600 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> R$ 600.000
                        </span>
                    </div>

                    <div className="flex flex-col p-3 rounded-lg border shadow-sm hover:shadow-lg transition">
                        <span className="text-xs text-gray-500">USD/BRL</span>
                        <span className="font-semibold text-gray-800">R$ 4,92</span>
                    </div>

                    <div className="flex flex-col p-3 rounded-lg border shadow-sm hover:shadow-lg transition col-span-2">
                        <span className="text-xs text-gray-500">Volume</span>
                        <span className="font-semibold text-gray-800">R$ 34,2 bi</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}