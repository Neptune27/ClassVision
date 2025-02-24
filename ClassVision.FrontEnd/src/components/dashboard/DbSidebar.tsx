"use client"
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    SquareTerminal,
} from "lucide-react"

import { NavMain } from "../nav-main"
import { NavProjects } from "../nav-projects"
import { NavUser } from "../nav-user"
import { SidebarHeader, SidebarContent, SidebarFooter, SidebarRail, Sidebar, SidebarGroup, SidebarGroupLabel, SidebarMenu } from "../ui/sidebar"
import DashboardSidebarHeaderContent from "./DashboardSidebarHeaderContent"
import DbSidebarMenuItem from "./DbSidebarMenuItem"
import DbCollapsableItem from "./DbCollapsableItem"
import DbSidebarMenuSubItem from "./DbSidebarMenuSubItem"


// This is sample data.
const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    team:
    {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
    },
    navMain: [
        {
            title: "Classroom",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },

        {
            title: "Accounts",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Classroomc",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
}



const DashboardSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <DashboardSidebarHeaderContent team={data.team} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Platform</SidebarGroupLabel>
                    <SidebarMenu>
                        <DbSidebarMenuItem name={"Classroom"} url={"/dashboard/classroom"} icon={Command} />
                        <DbSidebarMenuItem name={"Course Info"} url={"/dashboard/course-info"} icon={Command} />
                        <DbSidebarMenuItem name={"Course"} url={"/dashboard/course"} icon={Command} />
                        <DbSidebarMenuItem name={"Student"} url={"/dashboard/student"} icon={Command} />
                        <DbSidebarMenuItem name={"Teacher"} url={"/dashboard/teacher"} icon={Command} />
                        <DbCollapsableItem title={"Collapsed"} isActive={false} >
                        <DbSidebarMenuSubItem title={"Item 1"} url={"#"}/>
                        </DbCollapsableItem>
                    </SidebarMenu>
                </SidebarGroup>
                {/*<NavMain items={data.navMain} />*/}
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
export { DashboardSidebar }