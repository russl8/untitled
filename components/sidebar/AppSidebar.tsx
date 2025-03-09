import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import SidebarCheckbox from "./SidebarCheckbox"



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

          <SidebarCheckbox displayName="Box1" displayId={1} />
          <SidebarCheckbox displayName="Box2" displayId={2} />

          <SidebarCheckbox displayName="Box3" displayId={3} />
          <SidebarCheckbox displayName="Box4" displayId={4} />

        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
