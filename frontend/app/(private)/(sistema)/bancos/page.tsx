"use client";
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
    prefix: "entradas",
    label: "Desktop",
    color: "var(--color-14)",
  },
  mobile: {
    prefix: "entradas",
    label: "Mobile",
    color: "var(--color-15)",
  },
} satisfies ChartConfig

const chartConfigDois = {
  desktop: {
    prefix: "saidas",
    label: "Desktop",
    color: "var(--color-green-600)",
  },
  mobile: {
    prefix: "saidas",
    label: "Mobile",
    color: "var(--color-red-600)",
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
import { DataTable } from '@/components/dataTable';
import ChartCard from '@/components/chartCard';

export default function BancosPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="grid auto-rows-min gap-4 md:grid-cols-2">
          <ChartCard
            title="Receitas"
            description="Showing total visitors for the last 6 months"
            data={chartData}
            config={{
              desktop: {
                prefix: "receitas-desktop",
                label: "Desktop",
                color: "var(--color-14)",
              },
              mobile: {
                prefix: "receitas-mobile",
                label: "Mobile",
                color: "var(--color-15)",
              },
            }}
            dataKeys={["mobile", "desktop"]}
            footer={
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
            }
          />
          <ChartCard
            title="Despesas"
            description="Showing total visitors for the last 6 months"
            data={chartData}
            config={{
              desktop: {
                prefix: "despesas-desktop",
                label: "Desktop",
                color: "var(--color-green-600)",
              },
              mobile: {
                prefix: "despesas-mobile",
                label: "Mobile",
                color: "var(--color-red-600)",
              },
            }}
            dataKeys={["mobile", "desktop"]}
            footer={
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
            }
          />
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-1">

          <Card className="text-white shadow-lg" style={{ background: '#222' }}>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg">Bancos</CardTitle>
                <CardDescription>Gerencie suas instituições financeiras de forma prática</CardDescription>
              </div>
              <CardAction>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </CardAction>
            </CardHeader>
            <hr />
            <CardContent>
              <DataTable data={data} />
            </CardContent>

          </Card>

      </div>

    </div>
  )
}