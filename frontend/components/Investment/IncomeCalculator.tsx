"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function IncomeCalculator() {
    return (
        <Card className="gap-2 h-full">
            <CardHeader>
                <CardTitle>
                    Calculadora de Rendimentos
                </CardTitle>
            </CardHeader>
            <CardContent>
                <hr className="mb-4 border-gray-200" />
                <div className="space-y-7">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Valor do Investimento</label>
                        <Input placeholder="R$ 10.000,00" className="focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Taxa de Juros (% a.a.)</label>
                        <Input placeholder="12,5" className="focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Período (meses)</label>
                        <Input placeholder="12" className="focus:ring-2 focus:ring-purple-500" />
                    </div>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        Calcular Rendimento
                    </Button>
                    <div className="bg-gradient-to-r from-purple-50 to-purple-50 p-4 rounded-lg border border-purple-200">
                        <div className="text-sm text-gray-600 mb-1">Valor Final Estimado</div>
                        <div className="text-2xl font-bold text-purple-600 mb-1">R$ 11.250,00</div>
                        <div className="text-sm text-gray-600">Rendimento: <span className="font-semibold text-purple-600">R$ 1.250,00</span></div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}