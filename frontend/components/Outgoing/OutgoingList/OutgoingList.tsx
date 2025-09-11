"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Edit, Package, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Gasto } from "../types"
import { Filter } from "./Filter"
import { CATEGORIAS } from "../constants"
import React from "react"
import { Button } from "@/components/ui/button"

interface OutgoingListProps {
    gastos: Gasto[]
}

export function OutgoingList({ gastos }: OutgoingListProps) {

    const formatarMoeda = (valor: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor)
    }

    const totalGastos = useMemo(() => {
        return gastos.reduce((acc, gasto) => acc + gasto.valor, 0)
    }, [gastos])

    return (
        <div className="grid grid-cols-1 gap-7">
            <Filter />
            <Card className="gap-2">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <CardTitle className="text-lg">Gastos ({gastos.length})</CardTitle>
                        <Badge variant="outline" className="self-start sm:self-center text-purple-600 border-purple-600">
                            Total: {formatarMoeda(totalGastos)}
                        </Badge>
                    </div>
                    <CardDescription className="text-sm">
                        Lista de gastos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <hr className="mb-4 border-gray-200" />
                    {gastos.length === 0 ? (
                        <Alert>
                            <AlertDescription>
                                Nenhum gasto encontrado.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <div className="space-y-3">
                            {gastos.map((gasto) => {
                                const categoria = CATEGORIAS.find(c => c.nome === gasto.categoria)
                                const icon = categoria?.icone
                                return (
                                    <div
                                        key={gasto.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 border rounded-lg gap-3 sm:gap-4 border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 ease-in-out"
                                    >
                                        <div className="flex items-center gap-3 sm:gap-4 flex-1">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm sm:text-lg shadow-sm flex-shrink-0">
                                                {icon || <Package className="text-white h-4 w-4 sm:h-5 sm:w-5" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                                        <p className="font-semibold text-sm sm:text-base truncate">{gasto.descricao || gasto.categoria}</p>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground mt-1">
                                                        <span>{gasto.categoria}</span>
                                                        <span>
                                                            {new Date().getFullYear() === gasto.data.getFullYear()
                                                                ? format(new Date(gasto.data), "dd/MM 'às' HH:mm", { locale: ptBR })
                                                                : format(new Date(gasto.data), "dd/MM/yyyy", { locale: ptBR })
                                                            }
                                                        </span>
                                                        <Badge className={`text-xs ${gasto.tipo === 'fixo' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}`} >
                                                            {gasto.tipo === 'fixo' ? 'Fixo' : 'Variável'}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                                            <span className="text-base sm:text-lg font-semibold">
                                                {formatarMoeda(gasto.valor)}
                                            </span>
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
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}