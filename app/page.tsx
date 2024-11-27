import MainComponent from "@/components/user/MainComponent";
import Image from "next/image";

export default function Home() {
  return (
    <div className="grid  items-center justify-items-center min-h-screen xs-10 gap-4 xs:p-6 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-4 row-start-1 items-center sm:items-start">
        <MainComponent />
      </main>
    </div>
  );
}
