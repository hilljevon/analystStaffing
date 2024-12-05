"use client"

import React from 'react'
import {
    Ambulance,
    Calendar,
    CassetteTapeIcon,
    Clock,
    HomeIcon,
    Info,
    PhoneForwardedIcon,
    TableIcon,
} from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import Link from "next/link";

import { TooltipProvider } from "@radix-ui/react-tooltip"
import { usePathname } from 'next/navigation'
const sidebarItems = [
    {
        href: "/",
        label: "Home",
        icon: HomeIcon
    },
    {
        href: "/history",
        label: "History",
        icon: TableIcon
    },
]
import { cn } from '@/lib/utils'
const Sidebar = () => {
    const pathname = usePathname()
    console.log("path name here", pathname)
    return (
        <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
            <div className="border-b p-2">
                <Button variant="outline" size="icon" aria-label="Home">
                    <Clock fill="blue" className="stroke-white" />
                </Button>
            </div>
            <nav className="grid gap-1 p-2">
                {/* <TooltipProvider>
                <Link href={"/"}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg bg-muted"
                        aria-label="Playground"
                      >
                        <HomeIcon className="size-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                      New Entry
                    </TooltipContent>
                  </Tooltip>
                </Link>
              </TooltipProvider>
              <TooltipProvider>
                <Link href={"/history"}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-lg"
                        aria-label="Models"
                      >
                        <TableIcon className="size-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                      History
                    </TooltipContent>
                  </Tooltip>
                </Link>
                </TooltipProvider> */}
                {sidebarItems.map((item) => (
                    <TooltipProvider key={item.label}>
                        <Link href={item.href}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(pathname == item.href ? "rounded-lg bg-muted" : "rounded-lg")}
                                        aria-label="Playground"
                                    >
                                        <item.icon className={"size-5"} />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right" sideOffset={5}>
                                    {item.label}
                                </TooltipContent>
                            </Tooltip>
                        </Link>
                    </TooltipProvider>
                ))}
            </nav>
        </aside>
    )
}

export default Sidebar