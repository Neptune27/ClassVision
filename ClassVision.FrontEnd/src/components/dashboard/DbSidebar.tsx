"use client"
import {
    AudioWaveform,
    BookOpen,
    BookText,
    Bot,
    Calendar,
    CalendarPlus,
    Command,
    FileUser,
    Frame,
    GalleryVerticalEnd,
    GraduationCap,
    LandPlot,
    Map,
    Merge,
    Notebook,
    NotebookTabs,
    PieChart,
    School,
    Settings2,
    Speech,
    SquareTerminal,
    User,
    UserRound,
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
        name: localStorage.getItem("username"),
        email: localStorage.getItem("email"),
        avatar: "/avatars/shadcn.jpg",
    },
    team:
    {
        name: "ClassVision",
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
        <Sidebar collapsible="icon" {...props} >
            <SidebarHeader>
                <DashboardSidebarHeaderContent team={data.team} />
            </SidebarHeader>
            <SidebarContent>

                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarMenu>
                        <DbSidebarMenuItem name={"Class"} url={"/dashboard/info/class"} icon={School} />
                        <DbSidebarMenuItem name={"Attending"} url={"/dashboard/attending-class"} icon={Calendar} />
                    </SidebarMenu>
                </SidebarGroup>
                <SidebarGroup>
                    <SidebarGroupLabel>Management</SidebarGroupLabel>
                    <SidebarMenu>
                        <DbSidebarMenuItem name={"Attendee"} url={"/dashboard/attendee"} icon={Speech} />
                        <DbSidebarMenuItem name={"Classroom"} url={"/dashboard/classroom"} icon={LandPlot} />
                        <DbSidebarMenuItem name={"Course Info"} url={"/dashboard/course-info"} icon={BookText} />
                        <DbSidebarMenuItem name={"Course"} url={"/dashboard/course"} icon={NotebookTabs} />
                        <DbSidebarMenuItem name={"Enrollment"} url={"/dashboard/enrollment"} icon={Merge} />
                        <DbSidebarMenuItem name={"Student"} url={"/dashboard/student"} icon={GraduationCap} />
                        <DbSidebarMenuItem name={"Schedule"} url={"/dashboard/schedule"} icon={CalendarPlus} />
                        <DbSidebarMenuItem name={"Teacher"} url={"/dashboard/teacher"} icon={FileUser} />
                        <DbSidebarMenuItem name={"User"} url={"/dashboard/user"} icon={User} />
                        {/*<DbSidebarMenuItem name={"Test"} url={"/dashboard/test"} icon={Command} />*/}
                        {/*<DbCollapsableItem title={"Collapsed"} isActive={false} >*/}
                        {/*<DbSidebarMenuSubItem title={"Item 1"} url={"#"}/>*/}
                        {/*</DbCollapsableItem>*/}
                    </SidebarMenu>
                </SidebarGroup>
                {/*<NavMain items={data.navMain} />*/}
                {/*<NavProjects projects={data.projects} />*/}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
export { DashboardSidebar }