'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import SidebarCheckbox from "./SidebarCheckbox"
import { displays } from "@/lib/constants"
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton, useUser } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { UserProfile } from "@clerk/nextjs"
import { ChevronUp, CircleUser } from "lucide-react"
import { Button } from "../ui/button"

export function AppSidebar() {
  return (
    <Sidebar >
      <SidebarHeader />
      <SidebarContent>
        {/* <SidebarGroup>
          <SidebarGroupLabel>App</SidebarGroupLabel>
        </SidebarGroup> */}

        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>

          {Object.values(displays).map(d => (
            <SidebarCheckbox
              key={d.displayId}
              display={d}
            />
          ))}
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="p-0 m-0" >
        {/* <div className="flex items-center justify-between h-full w-full px-1 py-2 ">

          {user && <ChevronUp
            onClick={() => document.querySelector<HTMLButtonElement>(".cl-userButtonTrigger")?.click()}
            className="right-0 cursor-pointer hover:text-gray-600"
          />}
        </div> */}
      </SidebarFooter>
    </Sidebar>
  )
}
