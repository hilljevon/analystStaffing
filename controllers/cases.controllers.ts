"use server"
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/lib/database.types";
import { ScheduleInterface } from "@/components/user/SchedulesTable";
export async function postNewCases(entry: any) {
    try {
        const supabase = await createClient()
        const { data: cases, error: caseError } = await supabase
            .from("cases")
            .insert(entry)
            .select()
        if (!cases || caseError) {
            console.log("Unable to add new entry. Error here", caseError)
            return null
        }
        if (cases) {
            console.log("Cases here", cases)
            return cases
        }
    } catch (error) {
        console.log("Unable to post new schedule. Error here", error);
        return null
    }
}