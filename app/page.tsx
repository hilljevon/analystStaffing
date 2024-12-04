import MainComponent from "@/components/user/MainComponent";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient()
  const { data: schedules } = await supabase
    .from("schedules")
    .select("*")
  console.log("Schedules here", schedules)
  if (!schedules) return null
  return (
    <div className="grid items-center justify-items-center min-h-screen gap-4 xs:p-2 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
        <MainComponent />
      </main>
    </div>
  );
}
