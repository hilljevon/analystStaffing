"use client"

import { Bird, CalendarIcon, Rabbit, Turtle } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { z } from "zod"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
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
    cmCount: z.number().gte(10).lte(30),
    cmaCount: z.number().gte(1).lte(10),
    analystScheduled: z.number().gte(12).lte(40),
    analystNeeded: z.number(),
    analystUsed: z.number(),
})

export default function MainComponent() {
    const [date, setDate] = useState<Date>()
    const [totalNeeded, setTotalNeeded] = useState(0)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cmCount: 0,
            cmaCount: 0,
            analystScheduled: 0,
            analystNeeded: 5,
            analystUsed: 0,

        }
    })
    // create a new sum value for analystsNeeded
    const handleInputChange = () => {
        const { analystScheduled, cmCount, cmaCount } = form.getValues()
        const newSum = cmCount + cmaCount - analystScheduled
        form.setValue("analystNeeded", newSum)
    }
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Values", values)
    }

    return (
        <div
            className="relative hidden flex-col items-start gap-4 md:flex"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid w-full items-start gap-6">
                    {/* Case Managers Fieldset  */}
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">Case Managers</legend>
                        {/* DATE FORM FORM */}
                        <div className="grid gap-3 col-span-full">
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
                        {/* CM + CMA DIV */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* CASE MANAGER FORM  */}
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="cmCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CM's</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    // Selects entire number upon input click
                                                    onFocus={(event) => event.target.select()}
                                                    placeholder="0" {...field}
                                                    // On change event added to inputs to account for string value error for numbers
                                                    onChange={event => {
                                                        field.onChange(+event.target.value)
                                                        handleInputChange()
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription># of scheduled RN's</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* CMA FORM */}
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="cmaCount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>CMA's</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    onFocus={(event) => event.target.select()}
                                                    placeholder="0"
                                                    {...field}
                                                    onChange={event => {
                                                        field.onChange(+event.target.value)
                                                        handleInputChange()
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription># of scheduled CMA's</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </fieldset>
                    {/* Scheduled Analysts Fieldset */}
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">Analysts</legend>
                        <div className="grid grid-cols-2 gap-3">
                            {/* SCHEDULED ANALYSTS FORM */}
                            <div className="col-span-full grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="analystScheduled"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Scheduled</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    onFocus={(event) => event.target.select()}
                                                    {...field}
                                                    onChange={event => {
                                                        field.onChange(+event.target.value)
                                                        handleInputChange()
                                                    }}
                                                />
                                            </FormControl>
                                            <FormDescription># of scheduled analysts</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </fieldset>
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">OT</legend>
                        {/* ANALYSTS NEEDED (CALCULATED) */}
                        <div className="col-span-2 grid gap-3">
                            <FormField
                                control={form.control}
                                name="analystNeeded"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Needed</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                readOnly
                                                placeholder="0"
                                                {...field}
                                                onChange={event => {
                                                    field.onChange(+event.target.value)
                                                    handleInputChange()
                                                }}
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
