"use client"

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
const formSchema = z.object({
    ccrCM: z.number().gte(-1).lte(50),
    trainingCM: z.number().gte(-1).lte(50),
    refCM: z.number().gte(-1).lte(50),
    scanCM: z.number().gte(-1).lte(50),
    nsCM: z.number().gte(-1).lte(50),
    dcpCMA: z.number().gte(-1).lte(50),
    refCMA: z.number().gte(-1).lte(50),
    ooaCMA: z.number().gte(-1).lte(50),
    ccrAnalysts: z.number().gte(-1).lte(50),
    ooaAnalysts: z.number().gte(-1).lte(50),
    trainingAnalysts: z.number().gte(-1).lte(50),
    refAnalysts: z.number().gte(-1).lte(50),
    dcpAnalysts: z.number().gte(-1).lte(50),
    scanAnalysts: z.number().gte(-1).lte(50),
    adAnalysts: z.number().gte(-1).lte(50),
    dctAnalysts: z.number().gte(-1).lte(50),
    stabilityAnalysts: z.number().gte(-1).lte(50),
    ntAnalysts: z.number().gte(-1).lte(50),
    nsAnalysts: z.number().gte(-1).lte(50),
    analystNeeded: z.number().gte(-1).lte(50),
    analystUsed: z.number().gte(-1).lte(50),
    totalRNs: z.number().gte(-1).lte(50),
    totalCMAs: z.number().gte(-1).lte(50),
    neededAnalysts: z.number(),
    scheduledAnalysts: z.number(),
    usedAnalysts: z.number(),
    otAnalysts: z.number()
})

export default function MainComponent() {
    const [date, setDate] = useState<Date>()
    const [totalNeeded, setTotalNeeded] = useState(0)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ccrCM: 0,
            trainingCM: 0,
            refCM: 0,
            scanCM: 0,
            nsCM: 0,
            dcpCMA: 0,
            refCMA: 0,
            ooaCMA: 0,
            ccrAnalysts: 0,
            ooaAnalysts: 0,
            trainingAnalysts: 0,
            refAnalysts: 0,
            dcpAnalysts: 0,
            scanAnalysts: 0,
            adAnalysts: 0,
            dctAnalysts: 0,
            stabilityAnalysts: 0,
            ntAnalysts: 0,
            nsAnalysts: 0,
            totalRNs: 0,
            totalCMAs: 0,
            neededAnalysts: 0,
            scheduledAnalysts: 0,
            usedAnalysts: 0,
            otAnalysts: 0
        }
    })
    // create a new sum value for analystsNeeded
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("TARGET HERE", e.target.name)
        if (e.target.name.includes("CM")) {
            let sum = 0
            const RNTotals = form.getValues(["ccrCM", "trainingCM", "refCM", "scanCM", "nsCM"])
            for (let int of RNTotals) {
                sum += int;
            }
            form.setValue("totalRNs", sum)
        }
        if (e.target.name.includes("CMA")) {
            let sum = 0
            console.log("CMA HERE")
            const CMAtotals = form.getValues(["dcpCMA", "refCMA", "ooaCMA"])
            for (let int of CMAtotals) {
                sum += int;
            }
            form.setValue("totalCMAs", sum)
        }
        // WHEN WE ADD TO OUR LIST OF ANALYSTS, WE NEED TO DO WHAT? WE NEED TO INCREASE OUR TOTAL 
        // if (e.target.name.includes("Analysts")) {
        //     let sum = 0
        //     const UAtotals = form.getValues(["ccrAnalysts", "ooaAnalysts", "trainingAnalysts", "refAnalysts", "dcpAnalysts", "scanAnalysts", "adAnalysts", "dctAnalysts", "stabilityAnalysts", "ntAnalysts", "nsAnalysts"])
        //     for (let int of UAtotals) {
        //         sum += int;
        //     }
        //     const totalNeeded = form.getValues(["totalRNs", "totalCMAs"])
        //     form.setValue("otAnalysts", totalNeeded[0] + totalNeeded[1] - sum)
        // }
        setNewAnalystCount()
    }
    const setNewAnalystCount = () => {
        let sum = 0;
        const totalNeeded = form.getValues(["totalRNs", "totalCMAs"]) as number[]
        const currentlyScheduled = form.getValues("scheduledAnalysts");
        const UAtotals = form.getValues(["ccrAnalysts", "ooaAnalysts", "trainingAnalysts", "refAnalysts", "dcpAnalysts", "scanAnalysts", "adAnalysts", "dctAnalysts", "stabilityAnalysts", "ntAnalysts", "nsAnalysts"])
        for (let int of UAtotals) {
            sum += int;
        }
        form.setValue("neededAnalysts", totalNeeded[0] + totalNeeded[1] - currentlyScheduled - sum)
    }
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Values", values)
    }
    return (
        <div
            className="relative hidden flex-col min-w-max items-start gap-4 md:flex mt-12"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-start gap-6">
                    {/* Case Managers Fieldset  */}
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-bold">Case Managers</legend>
                        {/* DATE FORM FORM */}
                        <div className="grid gap-3 col-span-full col-start-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[280px] justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
                                    <Select
                                        onValueChange={(value) =>
                                            setDate(addDays(new Date(), parseInt(value)))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent position="popper">
                                            <SelectItem value="0">Today</SelectItem>
                                            <SelectItem value="1">Tomorrow</SelectItem>
                                            <SelectItem value="3">In 3 days</SelectItem>
                                            <SelectItem value="7">In a week</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div className="rounded-md border">
                                        <Calendar mode="single" selected={date} onSelect={setDate} />
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        {/* CASE MANAGER GRID  */}
                        <div className="grid grid-cols-3 gap-4">
                            {/* CCR RN  */}
                            <div className="grid gap-3 col-span-1">
                                <FormField
                                    control={form.control}
                                    name="ccrCM"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CCR</FormLabel>
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
                                            <FormDescription># of CCR RN's</FormDescription>
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
                                            <FormLabel>Training</FormLabel>
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
                                            <FormDescription># of training RN's</FormDescription>
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
                                            <FormLabel>Referral</FormLabel>
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
                                            <FormDescription># of REF RN's</FormDescription>
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
                                            <FormLabel>SCAN</FormLabel>
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
                                            <FormDescription># of SCAN RN's</FormDescription>
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
                                            <FormLabel>Night Shift</FormLabel>
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
                                            <FormDescription># of NS RN's</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </fieldset>
                    {/* CMA FIELDSET */}
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-bold">Case Manager Assistants</legend>
                        {/* CMA GRID */}
                        <div className="grid gap-4 grid-cols-3">
                            {/* DCP CMA */}
                            <div className="grid gap-3 col-span-1">
                                <FormField
                                    control={form.control}
                                    name="dcpCMA"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>DCP</FormLabel>
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
                                            <FormDescription># of DCP CMA's</FormDescription>
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
                                            <FormLabel>Referral</FormLabel>
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
                                            <FormDescription># of REF CMA's</FormDescription>
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
                                            <FormLabel>OOA</FormLabel>
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
                                            <FormDescription># of OOA CMA's</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </fieldset>
                    {/* Scheduled Analysts Fieldset */}
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-bold">Analysts</legend>
                        <div className="grid grid-cols-4 gap-3">
                            {/* CCR ANALYST  */}
                            <div className="grid gap-3 col-span-1">
                                <FormField
                                    control={form.control}
                                    name="ccrAnalysts"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CCR</FormLabel>
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
                                            <FormDescription># of CCR UA's</FormDescription>
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
                                            <FormLabel>Training</FormLabel>
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
                                            <FormDescription># of training UA's</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* OOA ANALYST'S */}
                            <div className="grid gap-3 col-span-1">
                                <FormField
                                    control={form.control}
                                    name="trainingAnalysts"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>OOA</FormLabel>
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
                                            <FormDescription># of OOA UA's</FormDescription>
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
                                            <FormLabel>Referral</FormLabel>
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
                                            <FormDescription># of REF UA's</FormDescription>
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
                                            <FormLabel>DCP</FormLabel>
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
                                            <FormDescription># of DCP UA's</FormDescription>
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
                                            <FormLabel>SCAN</FormLabel>
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
                                            <FormDescription># of SCAN UA's</FormDescription>
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
                                            <FormLabel>AD</FormLabel>
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
                                            <FormDescription># of AD UA's</FormDescription>
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
                                            <FormLabel>DCT</FormLabel>
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
                                            <FormDescription># of DCT UA's</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* STABILITY ANALYST */}
                            <div className="grid gap-3 col-span-1">
                                <FormField
                                    control={form.control}
                                    name="dctAnalysts"
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
                                            <FormDescription># of Stability UA's</FormDescription>
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
                                            <FormLabel>NT</FormLabel>
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
                                            <FormDescription># of NT UA's</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* NS ANALYST */}
                            <div className="grid gap-3 col-span-1">
                                <FormField
                                    control={form.control}
                                    name="ntAnalysts"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nightshift</FormLabel>
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
                                            <FormDescription># of NS UA's</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </fieldset>
                    {/* TOTAL NEEDED */}
                    <fieldset className="grid gap-6 rounded-lg border p-4 grid-cols-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">Overview</legend>
                        {/* TOTAL RN'S */}
                        <div className="col-span-2 grid gap-3">
                            <FormField
                                control={form.control}
                                name="totalRNs"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total CM's</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                readOnly
                                                placeholder="0"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* TOTAL CMA'S */}
                        <div className="col-span-2 grid gap-3">
                            <FormField
                                control={form.control}
                                name="totalCMAs"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Total CMA's</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                readOnly
                                                placeholder="0"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* ANALYSTS NEEDED (CALCULATED) */}
                        <div className="col-span-2 grid gap-3">
                            <FormField
                                control={form.control}
                                name="neededAnalysts"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Analysts Needed</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                // Selects entire number upon input click
                                                onFocus={(event) => event.target.select()}
                                                placeholder="0" {...field}
                                                // On change event added to inputs to account for string value error for numbers
                                                readOnly
                                            />
                                        </FormControl>
                                        <FormDescription>OT Analysts needed.</FormDescription>
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* SUBMISSION BUTTON */}
                        <div className="col-span-full grid gap-3">
                            <Button type="submit" variant={"secondary"}>
                                Submit
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </Form>
        </div>
    )
}
