"use client"
import React from 'react'
export interface ScheduleInterface {
    id: number,
    created_at: string,
    date: string,
    ccrCM: number,
    trainingCM: number,
    refCM: number,
    scanCM: number,
    nsCM: number,
    dcpCMA: number,
    refCMA: number,
    ooaCMA: number,
    ccrAnalysts: number,
    ooaAnalysts: number,
    trainingAnalysts: number,
    refAnalysts: number,
    dcpAnalysts: number,
    scanAnalysts: number,
    adAnalysts: number,
    dctAnalysts: number,
    stabilityAnalysts: number,
    ntAnalysts: number,
    nsAnalysts: number,
    totalRNs: number,
    totalCMAs: number,
    neededAnalysts: number,
    scheduledAnalysts: number,
    usedAnalysts: number,
    otAnalysts: number
}
const SchedulesTable = ({ allSchedules }: { allSchedules: ScheduleInterface[] }) => {
    return (
        <div
            className="relative hidden flex-col min-w-max items-start gap-4 md:flex mt-12"
        >
            {allSchedules.map((schedule) => (
                <div key={schedule.id}>
                    {schedule.date}
                </div>
            ))}
        </div>
    )
}

export default SchedulesTable