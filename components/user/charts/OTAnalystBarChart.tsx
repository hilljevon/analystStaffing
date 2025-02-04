"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

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
import { useState } from "react"
const chartData = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
]


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

export function OTAnalystBarChart({ allSchedules, title, chartConfig }: { allSchedules: ScheduleDataRecharts[], title: string, chartConfig: any }) {


    return (
        <Card>
            <CardHeader>
                {title == "otAnalysts" ? (
                    <>
                        <CardTitle>OT Analyst Count</CardTitle>
                        <CardDescription>Head Count of OT Analysts</CardDescription>
                    </>

                ) : (
                    <>
                        <CardTitle>Scheduled Analysts</CardTitle>
                        <CardDescription>Head Count of Scheduled Analysts</CardDescription>
                    </>
                )}

            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={allSchedules.slice(0, 14).reverse()}
                        margin={{
                            top: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="formattedDate"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey={title} fill={`var(--color-${title})`} radius={8}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
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
