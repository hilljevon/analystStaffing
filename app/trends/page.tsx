import { ChartConfig } from '@/components/ui/chart'
import { OTAnalystBarChart } from '@/components/user/charts/OTAnalystBarChart'
import StaffedVNeededBarChart from '@/components/user/charts/StaffedVNeededBarChart'
import ErrorPage from '@/components/user/ErrorPage'
import { fetchAllSchedules, handleAllSchedulesDataRecharts } from '@/controllers/schedules.controllers'
import React from 'react'
const allSchedules = [
    {
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
        neededAnalysts: 32,
        scheduledAnalysts: 32,
        // THIS IS STAFFED ANALYST METRIC. NEED TO COMPARE THIS WITH THE NEEDEDANALYST METRIC
        usedAnalysts: 35,
        otAnalysts: 0
    },
    {
        id: 21,
        created_at: '2024-12-18T02:09:59.803229+00:00',
        date: '2024-12-18T08:00:00.000Z',
        ccrCM: 25,
        trainingCM: 0,
        refCM: 0,
        scanCM: 2,
        nsCM: 1,
        dcpCMA: 3,
        refCMA: 1,
        ooaCMA: 1,
        ccrAnalysts: 25,
        ooaAnalysts: 1,
        trainingAnalysts: 0,
        refAnalysts: 0,
        dcpAnalysts: 2,
        scanAnalysts: 2,
        adAnalysts: 3,
        dctAnalysts: 1,
        stabilityAnalysts: 2,
        ntAnalysts: 0,
        nsAnalysts: 2,
        totalRNs: 28,
        totalCMAs: 5,
        neededAnalysts: 33,
        scheduledAnalysts: 31,
        usedAnalysts: 38,
        otAnalysts: 0
    },
    {
        id: 20,
        created_at: '2024-12-18T01:57:48.247149+00:00',
        date: '2024-12-17T08:00:00.000Z',
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
        dcpAnalysts: 2,
        scanAnalysts: 2,
        adAnalysts: 3,
        dctAnalysts: 1,
        stabilityAnalysts: 2,
        ntAnalysts: 0,
        nsAnalysts: 0,
        totalRNs: 27,
        totalCMAs: 5,
        neededAnalysts: 32,
        scheduledAnalysts: 32,
        usedAnalysts: 34,
        otAnalysts: 0
    },
    {
        id: 18,
        created_at: '2024-12-17T01:19:16.755925+00:00',
        date: '2024-12-17T01:14:19.969Z',
        ccrCM: 20,
        trainingCM: 1,
        refCM: 1,
        scanCM: 2,
        nsCM: 1,
        dcpCMA: 4,
        refCMA: 1,
        ooaCMA: 1,
        ccrAnalysts: 20,
        ooaAnalysts: 1,
        trainingAnalysts: 0,
        refAnalysts: 0,
        dcpAnalysts: 2,
        scanAnalysts: 2,
        adAnalysts: 3,
        dctAnalysts: 1,
        stabilityAnalysts: 2,
        ntAnalysts: 0,
        nsAnalysts: 2,
        totalRNs: 25,
        totalCMAs: 6,
        neededAnalysts: 31,
        scheduledAnalysts: 30,
        usedAnalysts: 33,
        otAnalysts: 0
    },
    {
        id: 15,
        created_at: '2024-12-15T17:18:11.986875+00:00',
        date: '2024-12-15T17:17:33.234Z',
        ccrCM: 15,
        trainingCM: 1,
        refCM: 2,
        scanCM: 2,
        nsCM: 1,
        dcpCMA: 6,
        refCMA: 2,
        ooaCMA: 1,
        ccrAnalysts: 15,
        ooaAnalysts: 1,
        trainingAnalysts: 0,
        refAnalysts: 0,
        dcpAnalysts: 3,
        scanAnalysts: 2,
        adAnalysts: 2,
        dctAnalysts: 1,
        stabilityAnalysts: 2,
        ntAnalysts: 0,
        nsAnalysts: 0,
        totalRNs: 21,
        totalCMAs: 9,
        neededAnalysts: 30,
        scheduledAnalysts: 29,
        usedAnalysts: 26,
        otAnalysts: 0
    },
    {
        id: 16,
        created_at: '2024-12-15T17:46:40.563882+00:00',
        date: '2024-12-14T08:00:00.000Z',
        ccrCM: 20,
        trainingCM: 0,
        refCM: 0,
        scanCM: 2,
        nsCM: 1,
        dcpCMA: 3,
        refCMA: 1,
        ooaCMA: 1,
        ccrAnalysts: 20,
        ooaAnalysts: 1,
        trainingAnalysts: 0,
        refAnalysts: 0,
        dcpAnalysts: 0,
        scanAnalysts: 2,
        adAnalysts: 3,
        dctAnalysts: 1,
        stabilityAnalysts: 2,
        ntAnalysts: 0,
        nsAnalysts: 0,
        totalRNs: 23,
        totalCMAs: 5,
        neededAnalysts: 28,
        scheduledAnalysts: 28,
        usedAnalysts: 29,
        otAnalysts: 1
    },
    {
        id: 17,
        created_at: '2024-12-15T18:18:59.60642+00:00',
        date: '2024-12-13T08:00:00.000Z',
        ccrCM: 13,
        trainingCM: 1,
        refCM: 0,
        scanCM: 1,
        nsCM: 1,
        dcpCMA: 3,
        refCMA: -1,
        ooaCMA: 0,
        ccrAnalysts: 13,
        ooaAnalysts: 0,
        trainingAnalysts: 0,
        refAnalysts: 0,
        dcpAnalysts: 0,
        scanAnalysts: 1,
        adAnalysts: 2,
        dctAnalysts: 1,
        stabilityAnalysts: 2,
        ntAnalysts: 0,
        nsAnalysts: 0,
        totalRNs: 16,
        totalCMAs: 2,
        neededAnalysts: 18,
        scheduledAnalysts: 20,
        usedAnalysts: 19,
        otAnalysts: 2
    },
    {
        id: 13,
        created_at: '2024-12-10T20:28:31.988217+00:00',
        date: '2024-12-10T20:27:36.927Z',
        ccrCM: 18,
        trainingCM: 1,
        refCM: 1,
        scanCM: 3,
        nsCM: 1,
        dcpCMA: 6,
        refCMA: 2,
        ooaCMA: 1,
        ccrAnalysts: 18,
        ooaAnalysts: 1,
        trainingAnalysts: 1,
        refAnalysts: 0,
        dcpAnalysts: 3,
        scanAnalysts: 3,
        adAnalysts: 3,
        dctAnalysts: 1,
        stabilityAnalysts: 2,
        ntAnalysts: 0,
        nsAnalysts: 0,
        totalRNs: 24,
        totalCMAs: 9,
        neededAnalysts: 33,
        scheduledAnalysts: 30,
        usedAnalysts: 32,
        otAnalysts: 3
    },
    {
        id: 14,
        created_at: '2024-12-10T20:30:37.936604+00:00',
        date: '2024-12-09T08:00:00.000Z',
        ccrCM: 16,
        trainingCM: 1,
        refCM: 1,
        scanCM: 2,
        nsCM: 1,
        dcpCMA: 6,
        refCMA: 2,
        ooaCMA: 1,
        ccrAnalysts: 16,
        ooaAnalysts: 1,
        trainingAnalysts: 0,
        refAnalysts: 0,
        dcpAnalysts: 0,
        scanAnalysts: 2,
        adAnalysts: 3,
        dctAnalysts: 1,
        stabilityAnalysts: 2,
        ntAnalysts: 0,
        nsAnalysts: 0,
        totalRNs: 21,
        totalCMAs: 9,
        neededAnalysts: 30,
        scheduledAnalysts: 27,
        usedAnalysts: 25,
        otAnalysts: 3
    },
    {
        id: 11,
        created_at: '2024-12-07T01:06:40.195764+00:00',
        date: '2024-12-05T08:00:00.000Z',
        ccrCM: 15,
        trainingCM: 1,
        refCM: 1,
        scanCM: 1,
        nsCM: 1,
        dcpCMA: 6,
        refCMA: 1,
        ooaCMA: 1,
        ccrAnalysts: 15,
        ooaAnalysts: 1,
        trainingAnalysts: 0,
        refAnalysts: 0,
        dcpAnalysts: 2,
        scanAnalysts: 1,
        adAnalysts: 2,
        dctAnalysts: 1,
        stabilityAnalysts: 2,
        ntAnalysts: 0,
        nsAnalysts: 3,
        totalRNs: 19,
        totalCMAs: 8,
        neededAnalysts: 27,
        scheduledAnalysts: 26,
        usedAnalysts: 27,
        otAnalysts: 3
    },
    {
        id: 12,
        created_at: '2024-12-07T01:08:38.285128+00:00',
        date: '2024-12-02T08:00:00.000Z',
        ccrCM: 25,
        trainingCM: 1,
        refCM: 1,
        scanCM: 1,
        nsCM: 1,
        dcpCMA: 1,
        refCMA: 1,
        ooaCMA: 1,
        ccrAnalysts: 25,
        ooaAnalysts: 1,
        trainingAnalysts: 0,
        refAnalysts: 1,
        dcpAnalysts: 1,
        scanAnalysts: 1,
        adAnalysts: 3,
        dctAnalysts: 1,
        stabilityAnalysts: 2,
        ntAnalysts: 0,
        nsAnalysts: 0,
        totalRNs: 29,
        totalCMAs: 3,
        neededAnalysts: 32,
        scheduledAnalysts: 34,
        usedAnalysts: 35,
        otAnalysts: 0
    },
    {
        id: 9,
        created_at: '2024-12-05T23:44:14.285598+00:00',
        date: '2024-11-24T08:00:00.000Z',
        ccrCM: 20,
        trainingCM: 1,
        refCM: 2,
        scanCM: 3,
        nsCM: 2,
        dcpCMA: 6,
        refCMA: 1,
        ooaCMA: 1,
        ccrAnalysts: 20,
        ooaAnalysts: 1,
        trainingAnalysts: 1,
        refAnalysts: 3,
        dcpAnalysts: 3,
        scanAnalysts: 3,
        adAnalysts: 2,
        dctAnalysts: 1,
        stabilityAnalysts: 2,
        ntAnalysts: 0,
        nsAnalysts: 3,
        totalRNs: 28,
        totalCMAs: 8,
        neededAnalysts: 36,
        scheduledAnalysts: 33,
        usedAnalysts: 39,
        otAnalysts: 7
    }
]
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
    otAnalysts: number
}
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const OTChartConfig = {
    otAnalysts: {
        label: "OT Analysts",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig
const scheduledChartConfig = {
    scheduledAnalysts: {
        label: "Scheduled Analysts",
        color: "teal",
    },
} satisfies ChartConfig
const page = async () => {
    // const allSchedules = await fetchAllSchedules()
    // if (allSchedules == null || allSchedules == undefined) return <ErrorPage />
    // console.log("All schedules here", allSchedules)
    const reformattedSchedules = allSchedules.map((item) => {
        const date = new Date(item.date);
        const dayIndex = date.getDay();
        const formattedDate = [
            String(date.getMonth() + 1).padStart(2, '0'), // Month (1-based, so add 1)
            String(date.getDate()).padStart(2, '0'),     // Day                    
        ].join('/');
        return { ...item, fullFormattedDate: `${weekdays[dayIndex].slice(0, 3)} ${formattedDate}`, formattedDate }
    })
    return (
        <>
            <header className="top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                <h1 className="text-xl font-semibold">Trends</h1>
            </header>
            <div className="gap-4 p-4 pt-0">
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="col-span-2 mt-4">
                        <StaffedVNeededBarChart allSchedules={reformattedSchedules} />
                    </div>
                    <div className="col-span-2 mt-4">
                        <OTAnalystBarChart allSchedules={reformattedSchedules} title={"otAnalysts"} chartConfig={OTChartConfig} />
                    </div>
                    <div className="col-span-2 mt-4">
                        <OTAnalystBarChart allSchedules={reformattedSchedules} title={"scheduledAnalysts"} chartConfig={scheduledChartConfig} />
                    </div>
                </div>
            </div>

        </>
    )
}

export default page