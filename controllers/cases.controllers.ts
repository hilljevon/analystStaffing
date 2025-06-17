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
// Need to rename, this function is retrieving all relevant cases specified by the date.
export async function retrieveCasesForUpdate(date: string) {
    try {
        const supabase = await createClient()
        const { data: cases, error: caseError } = await supabase
            .from("cases")
            .select()
            .eq("censusDate", date)
        if (cases) {
            return cases
        } else {
            console.log("Error grabbing cases", caseError)
        }
    } catch (error: any) {
        console.log("Unable to update cases. Error here", error)
    }
}
export async function updateAllCases(cases: any[]) {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('cases')
            .upsert(cases)
            .select()
        if (data) {
            return data
        } else {
            console.log("Error grabbing cases", error)
        }
    } catch (error: any) {
        console.log("Unable to update cases. Error here", error)
    }
}
export async function predictCases(cases: any[]) {

}