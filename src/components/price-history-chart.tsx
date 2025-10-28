"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Legend } from "recharts"
import React, { useState } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { PriceHistoryPoint } from "@/lib/types"
import { es } from "date-fns/locale"

interface PriceHistoryChartProps {
    data: PriceHistoryPoint[];
}

const chartConfig = {
  normalPrice: {
    label: "Precio Normal",
    color: "hsl(var(--chart-1))",
  },
  offerPrice: {
    label: "Precio Oferta",
    color: "hsl(var(--chart-2))",
  },
}

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  const [activeChart, setActiveChart] = useState<string | null>(null);

  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
        <LineChart
            accessibilityLayer
            data={data}
            margin={{
                left: 12,
                right: 12,
                top: 12
            }}
            onMouseMove={(state) => {
              if (state.isTooltipActive && state.activePayload?.[0]) {
                setActiveChart(state.activePayload[0].dataKey);
              }
            }}
            onMouseLeave={() => {
              setActiveChart(null);
            }}
        >
        <CartesianGrid vertical={false} />
        <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-CL", {
                    month: "short",
                    day: "numeric",
                });
            }}
        />
        <YAxis
            domain={['dataMin - 5000', 'dataMax + 5000']}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${new Intl.NumberFormat('es-CL').format(value as number)}`}
        />
        <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent 
                indicator="dot"
                formatter={(value, name) => {
                    const price = `$${new Intl.NumberFormat('es-CL').format(value as number)}`;
                    if (name === 'normalPrice') return [price, 'Precio Normal'];
                    if (name === 'offerPrice') return [price, 'Precio Oferta'];
                    return [price, name];
                }}
                labelFormatter={(label, payload) => {
                     if (payload && payload.length > 0) {
                        const date = new Date(payload[0].payload.date);
                        return date.toLocaleDateString("es-CL", {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        });
                    }
                    return label;
                }}
            />}
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
            dataKey="normalPrice"
            type="natural"
            stroke="var(--color-normalPrice)"
            strokeWidth={2}
            dot={false}
            name="Precio Normal"
            strokeOpacity={activeChart === null || activeChart === 'normalPrice' ? 1 : 0.25}
        />
        <Line
            dataKey="offerPrice"
            type="natural"
            stroke="var(--color-offerPrice)"
            strokeWidth={2}
            dot={false}
            name="Precio Oferta"
            strokeOpacity={activeChart === null || activeChart === 'offerPrice' ? 1 : 0.25}
        />
        </LineChart>
    </ChartContainer>
  )
}
