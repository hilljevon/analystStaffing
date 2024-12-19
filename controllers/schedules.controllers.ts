"use server"
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/database.types";
import { ScheduleInterface } from "@/components/user/SchedulesTable";

export async function postNewSchedule(entry: any) {
    try {
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
            return schedules
        }
    } catch (error) {
        console.log("Unable to post new schedule. Error here", error);
        return null
    }

}
export async function fetchAllSchedules() {
    try {
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
            return schedules
        }
    } catch (error) {
        console.log("Unable to fetch all schedules. Error here", error)
        return null;
    }

}
export async function editSchedule(scheduleId: number, updatedEntry: ScheduleInterface) {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from("schedules")
            .update(updatedEntry)
            .eq("id", scheduleId)
            .select()
        if (error) {
            console.log("Error here", error.message)
            return null;
        }
        console.log("Updated schedule", data)
        return data
    } catch (error) {
        console.log("Unable to edit schedule. See error here: ", error)
        return null;
    }

}
export async function deleteSchedule(scheduleId: number) {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from("schedules")
            .delete()
            .eq("id", scheduleId)
            .select()
        if (error) {
            console.log("Unable to delete schedule. Error here", error.message)
        }
        return data
    } catch (error) {
        console.log("Error deleting schedule. Message here: ", error)
        return null
    }
}
export async function handleAllSchedulesDataRecharts(data: any[]) {

}