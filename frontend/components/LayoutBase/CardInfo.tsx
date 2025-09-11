'use client'

import { ReactNode } from "react"
import { Card, CardHeader } from "@/components/ui/card"

interface MetricProps {
    title: ReactNode
    value: ReactNode
    icon: ReactNode
    bg: string
    color: string
    indicator?: string  
}

export function CardInfo({ metrics }: { metrics: MetricProps[] }) {
    return (
        <>
            {metrics.map((metric, index) => {
                const Icon = metric.icon as React.ComponentType<{ className?: string }>
                return (
                    <Card key={index} className="gap-2 h-full">
                        <CardHeader>
                            <div className="flex items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${metric.bg}`}>
                                    <Icon className={`w-6 h-6 ${metric.color}`} />
                                </div>
                                <div className="ml-3">
                                    <div className={`text-sm font-medium ${metric.color}`}>
                                        {metric.title}
                                    </div>
                                    <div className={`text-2xl font-bold ${metric.color} flex gap-1 items-start`}>
                                        {metric.value}
                                        {metric.indicator !== undefined && (
                                            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium">
                                                {metric.indicator > 0 ? '+' : ''}{metric.indicator}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                )
            })}
        </>
    )
}