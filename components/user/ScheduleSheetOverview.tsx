"use client"
import React from 'react'
import { ScheduleInterface } from './SchedulesTable'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
const ScheduleSheetOverview = ({ schedule }: { schedule: ScheduleInterface }) => {
    const dt = schedule.date;
    const date = new Date(dt);
    const formattedDate = [
        String(date.getMonth() + 1).padStart(2, '0'), // Month (1-based, so add 1)
        String(date.getDate()).padStart(2, '0'),     // Day
        date.getFullYear()                           // Year
    ].join('/');
    return (
        <Sheet>
            <SheetTrigger>Edit</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Date: {formattedDate}</SheetTitle>
                    <SheetDescription>

                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default ScheduleSheetOverview