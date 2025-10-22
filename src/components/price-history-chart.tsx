"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

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
} from "@/components/ui/chart"
import type { PriceHistoryPoint } from "@/lib/types"

interface PriceHistoryChartProps {
    data: PriceHistoryPoint[];
}

const chartConfig = {
  price: {
    label: "Price",
    color: "hsl(var(--primary))",
  },
}

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <LineChart
        accessibilityLayer
        data={data}
        margin={{
            left: 12,
            right: 12,
            top: 12
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
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `$${new Intl.NumberFormat('es-CL').format(value as number)}`}
        />
        <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent 
                indicator="dot"
                formatter={(value, name, props) => [`$${new Intl.NumberFormat('es-CL').format(value as number)}`, 'Precio']}
                labelFormatter={(label, payload) => {
                    const date = new Date(payload[0]?.payload.date);
                     return date.toLocaleDateString("es-CL", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                }}
            />}
        />
        <Line
            dataKey="price"
            type="natural"
            stroke="var(--color-price)"
            strokeWidth={2}
            dot={false}
        />
        </LineChart>
    </ChartContainer>
  )
}
