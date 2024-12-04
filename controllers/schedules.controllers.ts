"use server"
import { createClient } from "@/utils/supabase/server";

export async function postNewSchedule(entry: any) {
    const supabase = await createClient()
    const { data: schedules, error: scheduleError } = await supabase
        .from("schedules")
        .insert(entry)
        .select()
    console.log("Schedules here", schedules)
}