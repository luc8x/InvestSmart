"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

import {
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react"

export function RecentMovements() {

    const recentMovements = [
        {
            asset: "PETR4",
            type: "Compra",
            quantity: 100,
            price: "R$ 32,45",
            total: "R$ 3.245,00",
            date: "Hoje",
            isPositive: false
        },
        {
            asset: "VALE3",
            type: "Venda",
            quantity: 50,
            price: "R$ 68,20",
            total: "R$ 3.410,00",
            date: "Ontem",
            isPositive: true
        },
        {
            asset: "ITUB4",
            type: "Dividendo",
            quantity: 200,
            price: "R$ 0,15",
            total: "R$ 30,00",
            date: "2 dias",
            isPositive: true
        },
        {
            asset: "BBDC4",
            type: "Compra",
            quantity: 80,
            price: "R$ 15,80",
            total: "R$ 1.264,00",
            date: "3 dias",
            isPositive: false
        },
        {
            asset: "BBDC4",
            type: "Compra",
            quantity: 80,
            price: "R$ 15,80",
            total: "R$ 1.264,00",
            date: "3 dias",
            isPositive: false
        },
        {
            asset: "BBDC4",
            type: "Compra",
            quantity: 80,
            price: "R$ 15,80",
            total: "R$ 1.264,00",
            date: "3 dias",
            isPositive: false
        }
    ]

    return (
        <Card className="gap-2 h-full">
            <CardHeader>
                <CardTitle>Movimentações Recentes</CardTitle>
            </CardHeader>
            <CardContent>
                <hr className="mb-4 border-gray-200" />
                <div className="space-y-3">
                    <ScrollArea className="h-103">
                        <div className="flex flex-col gap-3 pr-1">
                            {recentMovements.map((movement, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg border shadow-sm hover:shadow-lg transition-all duration-200">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${movement.isPositive ? 'bg-purple-100 border-2 border-purple-200' : 'bg-gray-300 border-2 border-gray-200'
                                            }`}>
                                            {movement.isPositive ? (
                                                <ArrowUpRight className="w-5 h-5 text-purple-600" />
                                            ) : (
                                                <ArrowDownRight className="w-5 h-5 text-gray-600" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900 text-lg">{movement.asset}</div>
                                            <div className="text-sm text-gray-500">
                                                {movement.type} • {movement.quantity} ações
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-bold text-lg ${movement.isPositive ? 'text-purple-600' : 'text-gray-600'
                                            }`}>
                                            {movement.isPositive ? '+' : '-'} {movement.total}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {movement.price} • {movement.date}
                                        </div>
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