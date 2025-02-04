"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
]
const example = {
    id: 23,
    created_at: '2024-12-18T18:37:18.621856+00:00',
    date: '2024-12-19T08:00:00.000Z',
    ccrCM: 24,
    trainingCM: 0,
    refCM: 0,
    scanCM: 2,
    nsCM: 1,
    dcpCMA: 3,
    refCMA: 2,
    ooaCMA: 0,
    ccrAnalysts: 24,
    ooaAnalysts: 0,
    trainingAnalysts: 0,
    refAnalysts: 0,
    dcpAnalysts: 3,
    scanAnalysts: 2,
    adAnalysts: 3,
    dctAnalysts: 1,
    stabilityAnalysts: 2,
    ntAnalysts: 0,
    nsAnalysts: 2,
    totalRNs: 27,
    totalCMAs: 5,
    // this is calculated from fieldset total
    neededAnalysts: 32,
    // this is WIW total that we are comparing
    scheduledAnalysts: 32,
    usedAnalysts: 35,
    otAnalysts: 0
}
const chartConfig = {
    scheduledAnalysts: {
        label: "Scheduled",
        color: "hsl(var(--chart-1))",
    },
    neededAnalysts: {
        label: "Needed",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export interface ScheduleDataRecharts {
    id: number
    created_at: string
    date: string
    ccrCM: number
    trainingCM: number
    refCM: number
    scanCM: number
    nsCM: number
    dcpCMA: number
    refCMA: number
    ooaCMA: number
    ccrAnalysts: number
    ooaAnalysts: number
    trainingAnalysts: number
    refAnalysts: number
    dcpAnalysts: number
    scanAnalysts: number
    adAnalysts: number
    dctAnalysts: number
    stabilityAnalysts: number
    ntAnalysts: number
    nsAnalysts: number
    totalRNs: number
    totalCMAs: number
    neededAnalysts: number
    scheduledAnalysts: number
    usedAnalysts: number
    otAnalysts: number,
    fullFormattedDate: string,
    formattedDate: string
}
// This chart should show the difference between the neededAnalysts (total for day) and scheduledAnalysts (WIW)
export default function StaffedVNeededBarChart({ allSchedules }: { allSchedules: ScheduleDataRecharts[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-bold"> <span className="text-orange-400">Analysts Scheduled (WIW) </span>  vs.  <span className="text-green-600">Analyst Needed </span></CardTitle>
                <CardDescription>This graph shows how the number of analysts scheduled for the day compares to the number actually needed to cover that day's workload.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart height={400} width={200} accessibilityLayer data={allSchedules.slice(0, 6).reverse()}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="fullFormattedDate"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            tickFormatter={(value) => {
                                return value
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="scheduledAnalysts" fill="var(--color-scheduledAnalysts)" radius={1} />
                        <Bar dataKey="neededAnalysts" fill="var(--color-neededAnalysts)" radius={1} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {/* <div className="flex gap-2 font-medium leading-none">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Showing total visitors for the last 6 months
                </div> */}
            </CardFooter>
        </Card>
    )
}
