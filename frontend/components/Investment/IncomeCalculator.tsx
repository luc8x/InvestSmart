"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingUp, PiggyBank, Building2, Coins, Landmark, Banknote } from "lucide-react"
import { useState } from "react"

export function IncomeCalculator() {
    const [results, setResults] = useState({
        compound: { final: 0, profit: 0 },
        cdi: { final: 0, profit: 0 },
        treasury: { final: 0, profit: 0 },
        fund: { final: 0, profit: 0 }
    })

    const calculateCompound = (principal: number, rate: number, months: number) => {
        const monthlyRate = rate / 100 / 12
        const final = principal * Math.pow(1 + monthlyRate, months)
        return { final, profit: final - principal }
    }

    const calculateCDI = (principal: number, cdiRate: number, months: number) => {
        const monthlyRate = (cdiRate / 100) / 12
        const final = principal * Math.pow(1 + monthlyRate, months)
        return { final, profit: final - principal }
    }

    const calculateTreasury = (principal: number, rate: number, months: number) => {
        const monthlyRate = rate / 100 / 12
        const final = principal * Math.pow(1 + monthlyRate, months)
        const tax = months < 6 ? 0.225 : months < 12 ? 0.20 : months < 24 ? 0.175 : 0.15
        const profit = final - principal
        const finalAfterTax = principal + (profit * (1 - tax))
        return { final: finalAfterTax, profit: finalAfterTax - principal }
    }

    return (
        <Card className="gap-2">
            <CardHeader>
                <CardTitle>Calculadoras de Investimento</CardTitle>
            </CardHeader>
            <CardContent>
                <hr className="mb-4 border-gray-200" />
                
                <Tabs defaultValue="compound" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="compound" className="text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Juros
                        </TabsTrigger>
                        <TabsTrigger value="cdi" className="text-xs">
                            <Building2 className="w-3 h-3 mr-1" />
                            CDI
                        </TabsTrigger>
                        <TabsTrigger value="treasury" className="text-xs">
                            <PiggyBank className="w-3 h-3 mr-1" />
                            Tesouro
                        </TabsTrigger>
                        <TabsTrigger value="comparison" className="text-xs">
                            <Coins className="w-3 h-3 mr-1" />
                            Compare
                        </TabsTrigger>
                    </TabsList>

                    {/* Juros Compostos */}
                    <TabsContent value="compound" className="space-y-4 pt-5">
                        <CompoundCalculator onCalculate={(result) => setResults(prev => ({ ...prev, compound: result }))} />
                    </TabsContent>

                    {/* CDI */}
                    <TabsContent value="cdi" className="space-y-4 pt-5">
                        <CDICalculator onCalculate={(result) => setResults(prev => ({ ...prev, cdi: result }))} />
                    </TabsContent>

                    {/* Tesouro Direto */}
                    <TabsContent value="treasury" className="space-y-4 pt-5">
                        <TreasuryCalculator onCalculate={(result) => setResults(prev => ({ ...prev, treasury: result }))} />
                    </TabsContent>

                    {/* Comparação */}
                    <TabsContent value="comparison" className="space-y-4 pt-5">
                        <ComparisonView results={results} />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

function CompoundCalculator({ onCalculate }: { onCalculate: (result: any) => void }) {
    const [values, setValues] = useState({ principal: '', rate: '', months: '' })
    const [result, setResult] = useState({ final: 0, profit: 0 })

    const calculate = () => {
        const principal = parseFloat(values.principal.replace(/[^\d.,]/g, '').replace(',', '.'))
        const rate = parseFloat(values.rate)
        const months = parseInt(values.months)
        
        if (principal && rate && months) {
            const monthlyRate = rate / 100 / 12
            const final = principal * Math.pow(1 + monthlyRate, months)
            const newResult = { final, profit: final - principal }
            setResult(newResult)
            onCalculate(newResult)
        }
    }

    return (
        <div className="space-y-4 flex flex-col gap-4 h-full">
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-800 flex gap-2">
                    Esta simulação é apenas uma referência. Os valores podem variar conforme taxas praticadas pelo mercado e condições contratuais específicas.
                </p>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Valor Inicial</label>
                <Input
                    placeholder="R$ 10.000,00"
                    value={values.principal}
                    onChange={(e) => setValues(prev => ({ ...prev, principal: e.target.value }))}
                    className="focus:ring-2 focus:ring-purple-500"
                />
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Taxa (% a.a.)</label>
                    <Input
                        placeholder="12,5"
                        value={values.rate}
                        onChange={(e) => setValues(prev => ({ ...prev, rate: e.target.value }))}
                        className="focus:ring-2 focus:ring-purple-500"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Meses</label>
                    <Input
                        placeholder="12"
                        value={values.months}
                        onChange={(e) => setValues(prev => ({ ...prev, months: e.target.value }))}
                        className="focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>

            <Button onClick={calculate} className="w-full bg-purple-600 hover:bg-purple-700">
                Calcular Juros Compostos
            </Button>

            <div className="bg-gradient-to-r from-purple-50 to-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm text-gray-600 mb-1">Valor Final</div>
                <div className="text-xl font-bold text-purple-600 mb-1">
                    R$ {result.final.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">
                    Rendimento: <span className="font-semibold text-purple-600">
                        R$ {result.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
            </div>
        </div>
    )
}

function CDICalculator({ onCalculate }: { onCalculate: (result: any) => void }) {
    const [values, setValues] = useState({ principal: '', cdiPercent: '100', months: '' })
    const [result, setResult] = useState({ final: 0, profit: 0 })
    const currentCDI = 11.75

    const calculate = () => {
        const principal = parseFloat(values.principal.replace(/[^\d.,]/g, '').replace(',', '.'))
        const cdiPercent = parseFloat(values.cdiPercent)
        const months = parseInt(values.months)
        
        if (principal && cdiPercent && months) {
            const effectiveRate = (currentCDI * cdiPercent / 100)
            const monthlyRate = effectiveRate / 100 / 12
            const final = principal * Math.pow(1 + monthlyRate, months)
            const newResult = { final, profit: final - principal }
            setResult(newResult)
            onCalculate(newResult)
        }
    }

    return (
        <div className="space-y-4 flex flex-col gap-4 h-full">
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-800 flex gap-2">
                    Os cálculos apresentados têm caráter meramente ilustrativo e não constituem garantia de rentabilidade futura.
                </p>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Valor Inicial</label>
                <Input 
                    placeholder="R$ 10.000,00" 
                    value={values.principal}
                    onChange={(e) => setValues(prev => ({ ...prev, principal: e.target.value }))}
                    className="focus:ring-2 focus:ring-purple-500" 
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">% do CDI</label>
                    <Input 
                        placeholder="100" 
                        value={values.cdiPercent}
                        onChange={(e) => setValues(prev => ({ ...prev, cdiPercent: e.target.value }))}
                        className="focus:ring-2 focus:ring-purple-500" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Meses</label>
                    <Input 
                        placeholder="12" 
                        value={values.months}
                        onChange={(e) => setValues(prev => ({ ...prev, months: e.target.value }))}
                        className="focus:ring-2 focus:ring-purple-500" 
                    />
                </div>
            </div>
            <Button onClick={calculate} className="w-full bg-purple-600 hover:bg-purple-700">
                Calcular CDI
            </Button>
            <div className="bg-gradient-to-r from-purple-50 to-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm text-gray-600 mb-1">Valor Final</div>
                <div className="text-xl font-bold text-purple-600 mb-1">
                    R$ {result.final.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">
                    Rendimento: <span className="font-semibold text-purple-600">
                        R$ {result.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Taxa efetiva: {((currentCDI * parseFloat(values.cdiPercent || '100') / 100)).toFixed(2)}% a.a.
                </div>
            </div>
        </div>
    )
}

function TreasuryCalculator({ onCalculate }: { onCalculate: (result: any) => void }) {
    const [values, setValues] = useState({ principal: '', rate: '10.5', months: '' })
    const [result, setResult] = useState({ final: 0, profit: 0, tax: 0 })

    const calculate = () => {
        const principal = parseFloat(values.principal.replace(/[^\d.,]/g, '').replace(',', '.'))
        const rate = parseFloat(values.rate)
        const months = parseInt(values.months)
        
        if (principal && rate && months) {
            const monthlyRate = rate / 100 / 12
            const grossFinal = principal * Math.pow(1 + monthlyRate, months)
            const grossProfit = grossFinal - principal
            
            const taxRate = months <= 6 ? 0.225 : months <= 12 ? 0.20 : months <= 24 ? 0.175 : 0.15
            const tax = grossProfit * taxRate
            const final = grossFinal - tax
            
            const newResult = { final, profit: final - principal, tax }
            setResult(newResult)
            onCalculate({ final, profit: final - principal })
        }
    }

    return (
        <div className="space-y-4 flex flex-col gap-4 h-full">
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <p className="text-sm text-purple-800 flex gap-2">
                    Simulação baseada em títulos do Tesouro Direto. Os valores são estimativos e não representam garantia de rentabilidade.
                </p>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Valor Inicial</label>
                <Input 
                    placeholder="R$ 10.000,00" 
                    value={values.principal}
                    onChange={(e) => setValues(prev => ({ ...prev, principal: e.target.value }))}
                    className="focus:ring-2 focus:ring-purple-500" 
                />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Taxa (% a.a.)</label>
                    <Input 
                        placeholder="10,5" 
                        value={values.rate}
                        onChange={(e) => setValues(prev => ({ ...prev, rate: e.target.value }))}
                        className="focus:ring-2 focus:ring-purple-500" 
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Meses</label>
                    <Input 
                        placeholder="12" 
                        value={values.months}
                        onChange={(e) => setValues(prev => ({ ...prev, months: e.target.value }))}
                        className="focus:ring-2 focus:ring-purple-500" 
                    />
                </div>
            </div>
            <Button onClick={calculate} className="w-full bg-purple-600 hover:bg-purple-700">
                Calcular Tesouro Direto
            </Button>
            <div className="bg-gradient-to-r from-purple-50 to-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="text-sm text-gray-600 mb-1">Valor Final (líquido)</div>
                <div className="text-xl font-bold text-purple-600 mb-1">
                    R$ {result.final.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-sm text-gray-600">
                    Rendimento: <span className="font-semibold text-purple-600">
                        R$ {result.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    IR descontado: R$ {result.tax.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
            </div>
        </div>
    )
}

function ComparisonView({ results }: { results: any }) {
    const investments = [
        { name: 'Juros Compostos', result: results.compound, color: 'blue' },
        { name: 'CDI', result: results.cdi, color: 'yellow' },
        { name: 'Tesouro Direto', result: results.treasury, color: 'green' }
    ].filter(inv => inv.result.final > 0).sort((a, b) => b.result.final - a.result.final)

    if (investments.length === 0) {
        return (
            <div className="py-8 min-h-[460px] flex flex-col items-center justify-center">
                <Coins className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">Faça alguns cálculos para comparar os resultados</p>
            </div>
        )
    }

    return (
        <div className="space-y-4 flex flex-col gap-4 min-h-[460px]">
            <h3 className="font-semibold text-gray-800">Comparação de Resultados</h3>
            {investments.map((inv, index) => (
                <div key={inv.name} className={`p-4 rounded-lg border-2 ${
                    index === 0 ? 'border-purple-300 bg-purple-50' : 'border-gray-200 bg-gray-50'
                }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{inv.name}</span>
                                {index === 0 && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Melhor</span>}
                            </div>
                            <div className="text-sm text-gray-600">
                                Rendimento: R$ {inv.result.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold text-lg">
                                R$ {inv.result.final.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}