"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Search, ArrowUpDown } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CATEGORIAS } from "../constants"
import React from "react"

interface FilterProps {}

export function Filter({}: FilterProps) {
    return (
        <Card className="gap-2">
            <CardHeader>
                <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <hr className="mb-4 border-gray-200" />
                <div className="flex flex-col md:flex-row gap-7 md:gap-4 items-center">
                    <div>
                        <Label htmlFor="busca" className="text-sm font-medium">Buscar</Label>
                        <div className="relative mt-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                id="busca"
                                type="text"
                                placeholder="Buscar por descrição ou categoria..."
                                value=""
                                disabled
                                className="pl-10 min-w-80"
                            />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="categoria" className="text-sm font-medium">Categoria</Label>
                        <Select disabled>
                            <SelectTrigger className="mt-1 min-w-60">
                                <SelectValue placeholder="Todas as categorias" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="todas">Todas as categorias</SelectItem>
                                {CATEGORIAS.map(categoria => (
                                    <SelectItem key={categoria.nome} value={categoria.nome}>
                                        <span className="flex items-center gap-2">
                                            {categoria.icone} {categoria.nome}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="mes" className="text-sm font-medium">Mês</Label>
                        <Select disabled>
                            <SelectTrigger className="mt-1 min-w-60">
                                <SelectValue placeholder="Todos os meses" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Todos os meses</SelectItem>
                                {Array.from({ length: 12 }, (_, i) => (
                                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                                        {format(new Date(2024, i), "MMMM", { locale: ptBR })}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="ano" className="text-sm font-medium">Ano</Label>
                        <Select disabled>
                            <SelectTrigger className="mt-1 min-w-60">
                                <SelectValue placeholder="Todos os anos" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="0">Todos os anos</SelectItem>
                                {Array.from({ length: 5 }, (_, i) => {
                                    const ano = new Date().getFullYear() - i
                                    return (
                                        <SelectItem key={ano} value={ano.toString()}>
                                            {ano}
                                        </SelectItem>
                                    )
                                })}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <Label htmlFor="ordenacao" className="text-sm font-medium">Ordenar por</Label>
                        <Select disabled>
                            <SelectTrigger className="mt-1 min-w-60">
                                <SelectValue placeholder="Ordenação" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="data-desc">
                                    <span className="flex items-center gap-2">
                                        <ArrowUpDown className="h-4 w-4" />
                                        Data (mais recente)
                                    </span>
                                </SelectItem>
                                <SelectItem value="data-asc">
                                    <span className="flex items-center gap-2">
                                        <ArrowUpDown className="h-4 w-4" />
                                        Data (mais antiga)
                                    </span>
                                </SelectItem>
                                <SelectItem value="valor-desc">
                                    <span className="flex items-center gap-2">
                                        <ArrowUpDown className="h-4 w-4" />
                                        Valor (maior)
                                    </span>
                                </SelectItem>
                                <SelectItem value="valor-asc">
                                    <span className="flex items-center gap-2">
                                        <ArrowUpDown className="h-4 w-4" />
                                        Valor (menor)
                                    </span>
                                </SelectItem>
                                <SelectItem value="categoria">
                                    <span className="flex items-center gap-2">
                                        <ArrowUpDown className="h-4 w-4" />
                                        Categoria (A-Z)
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-end w-full">
                        <div className="flex items-center space-x-2 mt-6">
                            <Checkbox
                                id="mostrarDuplicatas"
                                checked={false}
                                disabled
                            />
                            <Label htmlFor="mostrarDuplicatas" className="text-sm font-medium cursor-pointer">
                                Mostrar duplicatas
                            </Label>
                        </div>
                    </div>

                    <div className="flex flex-col items-end justify-end w-full pt-10">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled
                            className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                        >
                            Limpar filtros
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}