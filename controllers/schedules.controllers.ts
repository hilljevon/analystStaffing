"use server"
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/database.types";
export async function postNewSchedule(entry: any) {
    const supabase = await createClient()

    const { data: schedules, error: scheduleError } = await supabase
        .from("schedules")
        .insert(entry)
        .select()
    if (!schedules || scheduleError) {
        console.log("Unable to add new entry. Error here", scheduleError)
        return null
    }
    if (schedules) {
        console.log("New Schedule here", schedules)
        return schedules
    }
}
export async function fetchAllSchedules() {
    const supabase = await createClient()
    const { data: schedules, error: scheduleError } = await supabase
        .from("schedules")
        .select("*")
        .order("date", { ascending: false })

    if (!schedules || scheduleError) {
        console.log("Unable to add new entry. Error here", scheduleError)
        return null
    }
    if (schedules) {
        console.log("All schedules here", schedules)
        return schedules
    }
}