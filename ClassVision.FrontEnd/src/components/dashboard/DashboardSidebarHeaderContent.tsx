"use client"

import { ChevronsUpDown, Plus } from "lucide-react"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "../ui/sidebar"

const DashboardSidebarHeaderContent = ({
    team,
}: {
    team: {
        name: string
        logo: React.ElementType
        plan: string
    }
}) => {
    const { isMobile } = useSidebar()
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <team.logo className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                            {team.name}
                        </span>
                        <span className="truncate text-xs">{team.plan}</span>
                    </div>
                    {/*<ChevronsUpDown className="ml-auto" />*/}
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

export default DashboardSidebarHeaderContent