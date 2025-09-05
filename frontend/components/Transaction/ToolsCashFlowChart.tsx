"use client"

import React, { useState, useMemo, useEffect } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    SelectLabel,
    SelectGroup,
} from "@/components/ui/select"

const mockData = {
    anual: [
        { dia: "Janeiro 2024", entrada: 15000, saida: 12000 },
        { dia: "Fevereiro 2024", entrada: 18000, saida: 14500 },
        { dia: "Março 2024", entrada: 22000, saida: 16800 },
        { dia: "Abril 2024", entrada: 19500, saida: 15200 },
        { dia: "Maio 2024", entrada: 21000, saida: 17300 },
        { dia: "Junho 2024", entrada: 24500, saida: 18900 },
        { dia: "Julho 2024", entrada: 26000, saida: 20100 },
        { dia: "Agosto 2024", entrada: 23500, saida: 19200 },
        { dia: "Setembro 2024", entrada: 25200, saida: 20800 }, 
        { dia: "Outubro 2024", entrada: 27800, saida: 22100 },
        { dia: "Novembro 2024", entrada: 29000, saida: 23500 },
        { dia: "Dezembro 2024", entrada: 31200, saida: 24800 },
    ],
    mensal: [
        { dia: "01 Dezembro", entrada: 2800, saida: 1200 },
        { dia: "05 Dezembro", entrada: 3200, saida: 1800 },
        { dia: "10 Dezembro", entrada: 2600, saida: 2100 },
        { dia: "15 Dezembro", entrada: 4100, saida: 2800 },
        { dia: "20 Dezembro", entrada: 3800, saida: 3200 },
        { dia: "25 Dezembro", entrada: 4500, saida: 2900 },
        { dia: "30 Dezembro", entrada: 5200, saida: 3400 },
    ],
    semanal: [
        { dia: "Segunda", entrada: 850, saida: 420 },
        { dia: "Terça", entrada: 920, saida: 680 },
        { dia: "Quarta", entrada: 1100, saida: 750 },
        { dia: "Quinta", entrada: 980, saida: 590 },
        { dia: "Sexta", entrada: 1250, saida: 820 },
        { dia: "Sábado", entrada: 680, saida: 340 },
        { dia: "Domingo", entrada: 420, saida: 180 },
    ],
    diario: [
        { dia: "Hoje", entrada: 1250, saida: 820 },
    ]
}

const previousMockData = {
    anual: [
        { dia: "Janeiro 2023", entrada: 12000, saida: 10500 },
        { dia: "Fevereiro 2023", entrada: 14500, saida: 12800 },
        { dia: "Março 2023", entrada: 16800, saida: 14200 },
        { dia: "Abril 2023", entrada: 15200, saida: 13600 },
        { dia: "Maio 2023", entrada: 17300, saida: 15100 },
        { dia: "Junho 2023", entrada: 18900, saida: 16400 },
        { dia: "Julho 2023", entrada: 20100, saida: 17800 },
        { dia: "Agosto 2023", entrada: 19200, saida: 16900 },
        { dia: "Setembro 2023", entrada: 20800, saida: 18200 },
        { dia: "Outubro 2023", entrada: 22100, saida: 19500 },
        { dia: "Novembro 2023", entrada: 23500, saida: 20800 },
        { dia: "Dezembro 2023", entrada: 24800, saida: 21900 },
    ],
    mensal: [
        { dia: "01 Novembro", entrada: 2400, saida: 1100 },
        { dia: "05 Novembro", entrada: 2800, saida: 1600 },
        { dia: "10 Novembro", entrada: 2200, saida: 1900 },
        { dia: "15 Novembro", entrada: 3700, saida: 2600 },
        { dia: "20 Novembro", entrada: 3400, saida: 2900 },
        { dia: "25 Novembro", entrada: 4100, saida: 2700 },
        { dia: "30 Novembro", entrada: 4800, saida: 3200 },
    ],
    semanal: [
        { dia: "Segunda", entrada: 780, saida: 380 },
        { dia: "Terça", entrada: 820, saida: 620 },
        { dia: "Quarta", entrada: 1000, saida: 680 },
        { dia: "Quinta", entrada: 880, saida: 540 },
        { dia: "Sexta", entrada: 1150, saida: 780 },    
        { dia: "Sábado", entrada: 620, saida: 310 },
        { dia: "Domingo", entrada: 380, saida: 160 },
    ],
    diario: [
        { dia: "Ontem", entrada: 1150, saida: 780 },
    ]
}

interface CashFlowData {
    dia: string
    entrada: number
    saida: number
}

interface ToolsCashFlowChartProps {
    onPeriodChange: (data: CashFlowData[], previousData?: CashFlowData[], period?: string) => void
}

export function ToolsCashFlowChart({ onPeriodChange }: ToolsCashFlowChartProps) {
    const [period, setPeriod] = useState("Mensal")

    const { filteredData, previousData } = useMemo(() => {
        let current: CashFlowData[]
        let previous: CashFlowData[] | undefined

        switch (period) {
            case "Anual":
                current = mockData.anual
                previous = previousMockData.anual
                break
            case "Mensal":
                current = mockData.mensal
                previous = previousMockData.mensal
                break
            case "Semanal":
                current = mockData.semanal
                previous = previousMockData.semanal
                break
            case "Diário":
                current = mockData.diario
                previous = previousMockData.diario
                break
            default:
                current = mockData.mensal
                previous = previousMockData.mensal
        }

        return { filteredData: current, previousData: previous }
    }, [period])

    useEffect(() => {
        onPeriodChange(filteredData, previousData, period)
    }, [filteredData, previousData, period, onPeriodChange])

    return (
        <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione um período" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Período</SelectLabel>
                    <SelectItem value="Anual">Anual</SelectItem>
                    <SelectItem value="Mensal">Mensal</SelectItem>
                    <SelectItem value="Semanal">Semanal</SelectItem>
                    <SelectItem value="Diário">Diário</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}
