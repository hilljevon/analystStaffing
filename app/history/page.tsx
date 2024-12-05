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
            <SchedulesTable allSchedules={allSchedules} />
        </>
    )
}

export default page