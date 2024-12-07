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
import { Bird, CalendarIcon, Rabbit, Turtle } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { z } from "zod"
import { Button } from "../ui/button"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import { cn } from "@/lib/utils"
import { format, addDays } from "date-fns"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "../ui/calendar"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/utils/supabase/client"
import { deleteSchedule, editSchedule, postNewSchedule } from "@/controllers/schedules.controllers"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const formSchema = z.object({
    ccrCM: z.number().gte(-1).lte(30),
    trainingCM: z.number().gte(-1).lte(3),
    refCM: z.number().gte(-1).lte(3),
    scanCM: z.number().gte(-1).lte(4),
    nsCM: z.number().gte(-1).lte(3),
    dcpCMA: z.number().gte(-1).lte(12),
    refCMA: z.number().gte(-1).lte(4),
    ooaCMA: z.number().gte(-1).lte(2),
    ccrAnalysts: z.number().gte(-1).lte(30),
    ooaAnalysts: z.number().gte(-1).lte(2),
    trainingAnalysts: z.number().gte(-1).lte(5),
    refAnalysts: z.number().gte(-1).lte(4),
    dcpAnalysts: z.number().gte(-1).lte(4),
    scanAnalysts: z.number().gte(-1).lte(4),
    adAnalysts: z.number().gte(-1).lte(5),
    dctAnalysts: z.number().gte(-1).lte(4),
    stabilityAnalysts: z.number().gte(-1).lte(7),
    ntAnalysts: z.number().gte(-1).lte(6),
    nsAnalysts: z.number().gte(-1).lte(6),
    totalRNs: z.number().gte(-1).lte(50),
    totalCMAs: z.number().gte(-1).lte(50),
    // calculated from CM + CMA sum 
    neededAnalysts: z.number(),
    // currently scheduled on WIW
    scheduledAnalysts: z.number(),
    // fieldset total for analysts
    usedAnalysts: z.number(),
    // to input after form submission
    otAnalysts: z.number(),
    created_at: z.string(),
    id: z.number(),
    date: z.string()
})
const ScheduleSheetOverview = ({ schedule }: { schedule: ScheduleInterface }) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ccrCM: schedule.ccrCM,
            trainingCM: schedule.trainingCM,
            refCM: schedule.refCM,
            scanCM: schedule.scanCM,
            nsCM: schedule.nsCM,
            dcpCMA: schedule.dcpCMA,
            refCMA: schedule.refCMA,
            ooaCMA: schedule.ooaCMA,
            ccrAnalysts: schedule.ccrAnalysts,
            ooaAnalysts: schedule.ooaAnalysts,
            trainingAnalysts: schedule.trainingAnalysts,
            refAnalysts: schedule.refAnalysts,
            dcpAnalysts: schedule.dcpAnalysts,
            scanAnalysts: schedule.scanAnalysts,
            adAnalysts: schedule.adAnalysts,
            dctAnalysts: schedule.dctAnalysts,
            stabilityAnalysts: schedule.stabilityAnalysts,
            ntAnalysts: schedule.ntAnalysts,
            nsAnalysts: schedule.nsAnalysts,
            totalRNs: schedule.totalRNs,
            totalCMAs: schedule.totalCMAs,
            neededAnalysts: schedule.neededAnalysts,
            scheduledAnalysts: schedule.scheduledAnalysts,
            usedAnalysts: schedule.usedAnalysts,
            otAnalysts: schedule.otAnalysts,
            created_at: schedule.created_at,
            id: schedule.id,
            date: schedule.date
        }
    })
    const dt = schedule.date;
    const date = new Date(dt);
    const formattedDate = [
        String(date.getMonth() + 1).padStart(2, '0'), // Month (1-based, so add 1)
        String(date.getDate()).padStart(2, '0'),     // Day
        date.getFullYear()                           // Year
    ].join('/');
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("New Values here", values)
        const newEntry = editSchedule(values.id, values)
        if (newEntry == null) {
            toast.error("Unable to edit schedule. Please see console.")
        } else {
            console.log("Entry here", newEntry)
            setIsOpen(false)
            toast.success("Entry successfully updated!")
            router.refresh()
        }
    }
    function handleDelete() {
        const deletedSchedule = deleteSchedule(schedule.id);
        if (deleteSchedule == null) {
            console.log("Unable to delete schedule");
            toast.error("Unable to delete schedule. Please see console and try again.");
        } else {
            toast.success("Successfully deleted schedule.")
            setIsOpen(false)
            router.refresh()
        }
    }
    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>Edit</SheetTrigger>
            <SheetContent side={"bottom"}>
                <SheetHeader>
                    <SheetTitle>Date: {formattedDate}</SheetTitle>
                    <SheetDescription asChild>
                        <div className='grid w-full items-start gap-6'>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-start gap-6">
                                    {/* OVERVIEW FIELDSET */}
                                    <fieldset className="grid gap-6 rounded-lg border p-4 grid-cols-4">
                                        <legend className="-ml-1 px-1 text-sm font-bold">Overview</legend>
                                        <div className="grid gap-3 col-span-1">
                                            <FormField
                                                control={form.control}
                                                name="scheduledAnalysts"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Scheduled Analysts</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"

                                                                onFocus={(event) => event.target.select()}
                                                                {...field}
                                                                onChange={event => {
                                                                    field.onChange(+event.target.value)
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-3 col-span-1">
                                            <FormField
                                                control={form.control}
                                                name="totalRNs"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Total CM's</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"

                                                                onFocus={(event) => event.target.select()}
                                                                {...field}
                                                                onChange={event => {
                                                                    field.onChange(+event.target.value)
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-3 col-span-1">
                                            <FormField
                                                control={form.control}
                                                name="totalCMAs"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Total CMA's</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"

                                                                onFocus={(event) => event.target.select()}
                                                                {...field}
                                                                onChange={event => {
                                                                    field.onChange(+event.target.value)
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-3 col-span-1">
                                            <FormField
                                                control={form.control}
                                                name="otAnalysts"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>OT Analysts</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"

                                                                onFocus={(event) => event.target.select()}
                                                                {...field}
                                                                onChange={event => {
                                                                    field.onChange(+event.target.value)
                                                                }}
                                                            />
                                                        </FormControl>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </fieldset>
                                    <fieldset className='grid gap-6 rounded-lg border p-4 grid-cols-5'>
                                        <legend className="-ml-1 px-1 text-sm font-bold">Advanced</legend>
                                        <Accordion className='col-span-full' type="single" collapsible>
                                            <AccordionItem value="item-1">
                                                <AccordionTrigger>Full Schedule</AccordionTrigger>
                                                <AccordionContent>
                                                    Insert other schedule info here.
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    </fieldset>
                                    <fieldset className="grid gap-6 rounded-lg border p-4 grid-cols-5">
                                        <legend className="-ml-1 px-1 text-sm font-bold">Actions</legend>
                                        {/* <div className="grid gap-3 col-span-1">
                                            <SheetPrimitive.Close asChild>
                                                <Button size={"sm"} variant={"secondary"} className=''>Cancel</Button>
                                            </SheetPrimitive.Close>
                                        </div> */}
                                        <div className="grid gap-3 col-span-2">
                                            <Button onClick={(e) => {
                                                e.preventDefault()
                                                handleDelete()
                                            }
                                            } variant={"destructive"} size={"sm"}>Delete</Button>
                                        </div>
                                        <div className="grid gap-3 col-start-4 col-span-2">
                                            <Button type='submit' size={"sm"} >Submit</Button>
                                        </div>
                                    </fieldset>
                                </form>
                            </Form>
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default ScheduleSheetOverview