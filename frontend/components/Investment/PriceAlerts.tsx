"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    TrendingUp,
    Plus,
    TrendingDown,
} from "lucide-react"

export function PriceAlerts() {
    const priceAlerts = [
        { asset: "PETR4", currentPrice: "R$ 32,45", targetPrice: "R$ 35,00", type: "alta", status: "ativo" },
        { asset: "VALE3", currentPrice: "R$ 68,20", targetPrice: "R$ 65,00", type: "baixa", status: "ativo" },
        { asset: "ITUB4", currentPrice: "R$ 28,90", targetPrice: "R$ 30,00", type: "alta", status: "pausado" },
        { asset: "BBDC4", currentPrice: "R$ 14,90", targetPrice: "R$ 31,00", type: "alta", status: "ativo" }
    ]
    return (
        <Card className="gap-2 h-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>
                        Alertas de Preços
                    </CardTitle>
                    <Button variant="outline" size="sm" className="hover:bg-purple-50 hover:text-purple-700">
                        <Plus className="w-4 h-4" />
                        Novo Alerta
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <hr className="mb-4 border-gray-200" />
                <div className="space-y-4">
                    <ScrollArea className="h-60">
                        <div className="flex flex-col gap-4 pr-1">
                            {priceAlerts.map((alert, index) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${alert.status === 'ativo' ? 'bg-purple-500 animate-pulse' : 'bg-gray-400'
                                            }`}></div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{alert.asset}</div>
                                            <div className="text-sm text-gray-500">
                                                {alert.currentPrice} → {alert.targetPrice}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge className={`text-xs ${alert.type === 'alta' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                            {alert.type === 'alta' ? (
                                                <TrendingUp className="w-3 h-3 mr-1" />
                                            ) : (
                                                <TrendingDown className="w-3 h-3 mr-1" />
                                            )}
                                            {alert.type}
                                        </Badge>
                                        <Badge className={`text-xs ${alert.status === 'ativo' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                            {alert.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    )
}