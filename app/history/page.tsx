import ErrorPage from '@/components/user/ErrorPage'
import SchedulesTable, { ScheduleInterface } from '@/components/user/SchedulesTable'
import { fetchAllSchedules } from '@/controllers/schedules.controllers'
import { createClient } from '@/utils/supabase/server'
import React from 'react'

const page = async () => {
    const allSchedules = await fetchAllSchedules()
    if (allSchedules == null || allSchedules == undefined) return ErrorPage
    return (
        <>
            <header className="top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                <h1 className="text-xl font-semibold">History</h1>
            </header>
            <div className="container mx-auto px-10">
                <SchedulesTable allSchedules={allSchedules} />
            </div>
        </>
    )
}

export default page