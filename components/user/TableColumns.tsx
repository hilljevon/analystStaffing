"use client"
import React from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { ScheduleInterface } from './SchedulesTable'
import { ArrowUpDown } from "lucide-react"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import ScheduleSheetOverview from './ScheduleSheetOverview'
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const TableColumns: ColumnDef<ScheduleInterface>[] = [
    {
        accessorKey: "date",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const dt = row.original.date;
            const date = new Date(dt);
            const dayIndex = date.getDay();
            const formattedDate = [
                String(date.getMonth() + 1).padStart(2, '0'), // Month (1-based, so add 1)
                String(date.getDate()).padStart(2, '0'),     // Day
                date.getFullYear()                           // Year
            ].join('/');
            return (
                <Button
                    variant="ghost"
                >
                    {`${weekdays[dayIndex]}, ${formattedDate}`}
                </Button>
            )
        }

    },
    {
        accessorKey: "scheduledAnalysts",
        header: "Scheduled Analysts"
    },
    {
        accessorKey: "otAnalysts",
        header: "OT Analysts"
    },
    {
        accessorKey: "usedAnalysts",
        header: "Staffed Analysts"
    },
    {
        accessorKey: "neededAnalysts",
        header: "Needed Analysts"
    },
    {
        accessorKey: "totalRNs",
        header: "Total CM's"
    },
    {
        accessorKey: "totalCMAs",
        header: "Total CMA's"
    },

    {
        cell: ({ row }) => {
            const sched = row.original;

            return (
                <ScheduleSheetOverview schedule={sched} />
            )
        },
        accessorKey: "id",
        header: ""
    }
]