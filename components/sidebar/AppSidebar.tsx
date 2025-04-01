'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"
import SidebarCheckbox from "./SidebarCheckbox"
import { displays } from "@/lib/constants"
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton, useUser } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { UserProfile } from "@clerk/nextjs"
import { ChevronUp, CircleUser } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar">
      <SidebarHeader className="bg-lusion-background text-lusion-black">
        <Link
          href="/"
          className={cn("ml-2 mt-2 text-3xl font-thin",
            {
              "hover:opacity-70 transition-opacity duration-300":true
            })}>
          Untitled.
        </Link>
      </SidebarHeader>
      <SidebarContent className="bg-lusion-background text-lusion-black">

        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarMenuSub>

            {Object.values(displays).map(d => (
              <SidebarCheckbox
                key={d.displayId}
                display={d}
              />
            ))}
          </SidebarMenuSub>

        </SidebarGroup>

      </SidebarContent>

    </Sidebar>
  )
}












/**
 * 
 *       <SidebarFooter className="p-0 m-0" >
        {/* <div className="flex items-center justify-between h-full w-full px-1 py-2 ">

          {user && <ChevronUp
            onClick={() => document.querySelector<HTMLButtonElement>(".cl-userButtonTrigger")?.click()}
            className="right-0 cursor-pointer hover:text-gray-600"
          />}
        </div> 
        </SidebarFooter>
 */