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
    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("New Values here", values)
        toast.info("Updating schedule...")
        const newEntry = await editSchedule(values.id, values)
        if (newEntry == null) {
            toast.error("Unable to edit schedule. Please see console.")
        } else {
            console.log("Entry here", newEntry)
            setIsOpen(false)
            router.refresh()
            toast.success("Entry successfully updated!")
        }
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Adjusting CM Total Count
        if (e.target.name.includes("CM")) {
            let sum = 0
            const RNTotals = form.getValues(["ccrCM", "trainingCM", "refCM", "scanCM", "nsCM"])
            for (let int of RNTotals) {
                sum += int;
            }
            form.setValue("totalRNs", sum)
        }
        // Adjusting CMA Total Count
        if (e.target.name.includes("CMA")) {
            let sum = 0
            const CMAtotals = form.getValues(["dcpCMA", "refCMA", "ooaCMA"])
            for (let int of CMAtotals) {
                sum += int;
            }
            form.setValue("totalCMAs", sum)
        }
        // if CM count changed, checkMatchInput function will update corresponding analyst count
        checkMatchInput(e)
        // After potentially updating UA count, we need to update analyst total counts.
        setNewAnalystCount()
    }
    const setNewAnalystCount = () => {
        // FIELDSET TOTAL
        let analystFieldsetTotal = 0
        // SUM OF ALL Analyst Fieldset Input Entries
        const fieldSetTotals = form.getValues(["adAnalysts", "dctAnalysts", "stabilityAnalysts", "ntAnalysts", "scanAnalysts", "dcpAnalysts", "refAnalysts", "trainingAnalysts", "ooaAnalysts", "ccrAnalysts"])
        // Getting OT count to add for USED analyst count
        const otAnalystCount = form.getValues("otAnalysts")
        for (let int of fieldSetTotals) {
            analystFieldsetTotal += int;
        }
        form.setValue("neededAnalysts", analystFieldsetTotal)
        form.setValue("usedAnalysts", analystFieldsetTotal + otAnalystCount)
    }
    const checkMatchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const matchingTargets = ["ccrCM", "scanCM", "ooaCMA"]
        const currentTarget = e.target.name;
        if (matchingTargets.includes(e.target.name)) {
            switch (currentTarget) {
                case "ccrCM":
                    form.setValue("ccrAnalysts", e.target.valueAsNumber)
                    break;
                case "scanCM":
                    form.setValue("scanAnalysts", e.target.valueAsNumber)
                    break;
                case "ooaCMA":
                    form.setValue("ooaAnalysts", e.target.valueAsNumber)
            }
        }
    }
    async function handleDelete() {
        toast.info("Deleting schedule...")
        const deletedSchedule = await deleteSchedule(schedule.id);
        if (deleteSchedule == null) {
            console.log("Unable to delete schedule");
            toast.error("Unable to delete schedule. Please see console and try again.");
        } else {
            toast.success("Successfully deleted schedule.")
            router.push("/history")
            setIsOpen(false)
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
                                    <fieldset className="grid gap-6 rounded-lg border p-4 grid-cols-3">
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
                                                                    handleInputChange(event)
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
                                                                    handleInputChange(event)
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
                                                                    handleInputChange(event)
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
                                                                    handleInputChange(event)
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
                                                name="neededAnalysts"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Needed Analysts</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                onFocus={(event) => event.target.select()}
                                                                {...field}
                                                                onChange={event => {
                                                                    field.onChange(+event.target.value)
                                                                    handleInputChange(event)
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
                                                    <div className='grid grid-cols-10 p-4 gap-6 text-sm'>
                                                        {/* CCR RN  */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="ccrCM"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>CCR CM</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>

                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* Training CM's */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="trainingCM"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>TRN CM</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>

                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* REF CM */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="refCM"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>REF CM</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>

                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* SCAN CM */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="scanCM"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>SCAN CM</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>

                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* NS CM */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="nsCM"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>NS CM</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* DCP CMA */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="dcpCMA"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>DCP CMA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* REF CMA */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="refCMA"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>REF CMA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* OOA CMA */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="ooaCMA"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>OOA CMA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* CCR ANALYSTS */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="ccrAnalysts"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>CCR UA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* Training ANALYST'S */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="trainingAnalysts"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>TRN UA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* OOA ANALYST'S */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="ooaAnalysts"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>OOA UA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* REF ANALYST */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="refAnalysts"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>REF UA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* DCP ANALYST */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="dcpAnalysts"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>DCP UA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* SCAN ANALYST */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="scanAnalysts"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>SCAN UA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* AD ANALYST */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="adAnalysts"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>AD UA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* DCT ANALYST */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="dctAnalysts"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>DCT UA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* STABILITY ANALYST */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="stabilityAnalysts"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Stability</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* NT ANALYST */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="ntAnalysts"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>NT UA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                // Selects entire number upon input click
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0" {...field}
                                                                                // On change event added to inputs to account for string value error for numbers
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                        {/* NS ANALYST */}
                                                        <div className="grid gap-3 col-span-1">
                                                            <FormField
                                                                control={form.control}
                                                                name="nsAnalysts"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>NS UA</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                type="number"
                                                                                onFocus={(event) => event.target.select()}
                                                                                placeholder="0"
                                                                                {...field}
                                                                                onChange={event => {
                                                                                    field.onChange(+event.target.value)
                                                                                    handleInputChange(event)
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    </div>
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