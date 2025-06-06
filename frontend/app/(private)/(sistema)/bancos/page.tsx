"use client";
import { MouseEffectCard } from '@/components/mouseEffectCard'
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardAction,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

import data from "./data.json"
import { DataTable } from '@/components/data-table';

export default function BancosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
        <MouseEffectCard>
          <Card className="text-white" style={{ backgroundColor: 'rgb(0, 23, 11)' }}>
            <CardHeader className='px-5'>
              <CardTitle>Entradas</CardTitle>
              <CardDescription>
                Showing total visitors for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className='px-5'>
              <ChartContainer config={chartConfig} className="h-60 w-full">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="url(#fillMobile)"
                    fillOpacity={0.4}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="url(#fillDesktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <hr />
            <CardFooter className='px-5'>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 leading-none">
                    January - June 2024
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </MouseEffectCard>
        <MouseEffectCard>
          <Card className="text-white" style={{ backgroundColor: '#251111' }}>
            <CardHeader className='px-5'>
              <CardTitle>Saídas</CardTitle>
              <CardDescription>
                Showing total visitors for the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent className='px-5'>
              <ChartContainer config={chartConfig} className="h-60 w-full">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  height={60}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <defs>
                    <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-desktop)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--color-mobile)"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="url(#fillMobile)"
                    fillOpacity={0.4}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="url(#fillDesktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <hr />
            <CardFooter className='px-5'>
              <div className="flex w-full items-start gap-2 text-sm">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 leading-none">
                    January - June 2024
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </MouseEffectCard>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-1">
        <MouseEffectCard>
          {/* <Card className="text-white shadow-lg" style={{ background: '#222' }}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg">Cadastrar Banco</CardTitle>
              <CardDescription>Adicione um novo banco ao sistema</CardDescription>
            </div>
            <CardAction>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent>
            <Button variant="secondary">Novo Banco</Button>
          </CardContent>

          <hr />

          <CardFooter>
            <p className="text-muted-foreground text-sm">
              Gerencie suas instituições financeiras de forma prática.
            </p>
          </CardFooter>
        </Card> */}

          <Card className="text-white shadow-lg" style={{ background: '#222' }}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg">Cadastrar Banco</CardTitle>
                <CardDescription>Adicione um novo banco ao sistema</CardDescription>
              </div>
              <CardAction>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </CardAction>
            </CardHeader>

            <CardContent>
              <DataTable data={data} />
            </CardContent>

            <hr />

            <CardFooter>
              <p className="text-muted-foreground text-sm">
                Gerencie suas instituições financeiras de forma prática.
              </p>
            </CardFooter>
          </Card>
        </MouseEffectCard>
      </div>

    </div>
  )
}