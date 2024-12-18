import MainComponent from "@/components/user/MainComponent";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export default async function Home() {

    return (
        <>
            <header className="top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
                <h1 className="text-xl font-semibold">Add Schedule</h1>
            </header>
            <div className="container mx-auto px-10">
                <MainComponent />
            </div>
        </>
    );
}
