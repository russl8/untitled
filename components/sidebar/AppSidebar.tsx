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


export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>App</SidebarGroupLabel>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>

          {Object.values(displays).map(d=>(
            <SidebarCheckbox
            key={d.displayId} 
            display={d}
            />
          ))}
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
