"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Target,
    Plus,
    Calendar,
    AlertCircle,
    CheckCircle,
    Clock,
    Edit,
    Trash2,
    Info
} from "lucide-react"

// Mock data para demonstração
const mockBudgetGoals = [
    {
        id: 1,
        title: "Reduzir Gastos com Alimentação",
        category: "Alimentação",
        currentAmount: 1200,
        targetAmount: 800,
        deadline: "2024-03-31",
        status: "em_progresso",
        description: "Meta de reduzir gastos com delivery e restaurantes"
    },
    {
        id: 2,
        title: "Economia em Transporte e Gastos com Entretenimento",
        category: "Transporte",
        currentAmount: 450,
        targetAmount: 300,
        deadline: "2024-04-15",
        status: "em_progresso",
        description: "Usar mais transporte público e menos Uber"
    },
    {
        id: 3,
        title: "Reduzir Gastos com Entretenimento",
        category: "Entretenimento",
        currentAmount: 200,
        targetAmount: 300,
        deadline: "2024-02-28",
        status: "concluida",
        description: "Limitar gastos com cinema e streaming"
    },
    {
        id: 4,
        title: "Reduzir Gastos com Entretenimento",
        category: "Entretenimento",
        currentAmount: 200,
        targetAmount: 300,
        deadline: "2024-02-28",
        status: "concluida",
        description: "Limitar gastos com cinema e streaming"
    },
    {
        id: 5,
        title: "Reduzir Gastos com Entretenimento",
        category: "Entretenimento",
        currentAmount: 200,
        targetAmount: 300,
        deadline: "2024-02-28",
        status: "concluida",
        description: "Limitar gastos com cinema e streaming"
    },
    {
        id: 6,
        title: "Reduzir Gastos com Entretenimento",
        category: "Entretenimento",
        currentAmount: 200,
        targetAmount: 300,
        deadline: "2024-02-28",
        status: "concluida",
        description: "Limitar gastos com cinema e streaming"
    },
    {
        id: 7,
        title: "Reduzir Gastos com Entretenimento",
        category: "Entretenimento",
        currentAmount: 200,
        targetAmount: 300,
        deadline: "2024-02-28",
        status: "concluida",
        description: "Limitar gastos com cinema e streaming"
    }
]

export function Budget() {
    const [activeTab, setActiveTab] = useState("visualizar")

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'concluida':
                return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100"><CheckCircle className="w-3 h-3 mr-1" />Concluída</Badge>
            case 'em_progresso':
                return <Badge className="bg-gray-200 text-gray-700"><Clock className="w-3 h-3 mr-1" />Em Progresso</Badge>
            case 'atrasada':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><AlertCircle className="w-3 h-3 mr-1" />Atrasada</Badge>
            default:
                return <Badge variant="secondary">Indefinido</Badge>
        }
    }

    const calculateProgress = (current: number, target: number) => {
        const saved = Math.max(0, current - target)
        return current <= target ? 100 : (saved / current) * 100
    }

    return (
        <>
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-4">
                {mockBudgetGoals.map((goal) => {
                    const progress = calculateProgress(goal.currentAmount, goal.targetAmount)

                    return (
                        <Card key={goal.id} className="shadow-md hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-md">{goal.title}</CardTitle>
                                    {getStatusBadge(goal.status)}
                                </div>
                                <p className="text-sm text-gray-600">{goal.description}</p>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Gasto Atual</span>
                                        <span className="font-semibold">{formatCurrency(goal.currentAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Meta</span>
                                        <span className="font-semibold text-green-600">{formatCurrency(goal.targetAmount)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Economia Necessária</span>
                                        <span className="font-semibold text-purple-600">
                                            {formatCurrency(Math.max(0, goal.currentAmount - goal.targetAmount))}
                                        </span>
                                    </div>
                                    
                                </div>

                                
                            </CardContent>
                            <CardFooter className="bottom-0 mt-auto">
                                <div className="w-full flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>Progresso</span>
                                                <span className="font-medium">{progress.toFixed(0)}%</span>
                                            </div>
                                            <Progress
                                                color="#9810FB"
                                                value={progress}
                                                className="h-2"
                                                />
                                        </div>

                                        <div className="text-sm text-gray-600 flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>

                                    <div className="bg-purple-50 rounded-lg p-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Info size={16} className="text-purple-500" />
                                                <span className="text-purple-700 font-medium text-sm">Gasto Ideal por Dia</span>
                                            </div>
                                            <span className="font-bold text-md text-purple-600">
                                                {formatCurrency((() => {
                                                    const today = new Date()
                                                    const deadline = new Date(goal.deadline)
                                                    return goal.targetAmount / 30
                                                })())}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-purple-600">
                                            Para atingir sua meta mensal
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center w-full">
                                        <div>
                                            <Badge variant="outline" className="w-fit text-purple-600 border-purple-600">
                                                {goal.category}
                                            </Badge>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-gray-600 hover:text-purple-800 hover:bg-purple-50"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 text-gray-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    )
                })}
            </div>

            {mockBudgetGoals.length === 0 && (
                <Card className="p-8 text-center">
                    <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma meta cadastrada</h3>
                    <p className="text-gray-500 mb-4">Comece criando sua primeira meta de redução de gastos</p>
                    <Button onClick={() => setActiveTab("cadastrar")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Meta
                    </Button>
                </Card>
            )}
        </>
    )
}