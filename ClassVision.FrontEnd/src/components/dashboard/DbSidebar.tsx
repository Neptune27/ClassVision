"use client"

import {
    AudioWaveform,
    BadgeCheck,
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
import { useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "../ui/button"
import { courseStore } from "../../stores/courseStores"
import { useSnapshot } from "valtio"
import { authorizedFetch } from "../../utils/authorizedFetcher"


const getRoles = () => {
    return JSON.parse(localStorage.getItem("roles") ?? "[]") as string[]
}

const data = {
    user: {
        name: localStorage.getItem("username") ?? "",
        email: localStorage.getItem("email") ?? "",
        avatar: "/avatars/shadcn.jpg",
    },
    team:
    {
        name: "ClassVision",
        logo: GalleryVerticalEnd,
        plan: getRoles().join(", "),
    },
}



const DashboardSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
    const roles = useMemo<string[]>(() => JSON.parse(localStorage.getItem("roles") ?? "[]"), [])
    const store = courseStore;
    const snap = useSnapshot(store)

    const fetchData = async () => {
        const resp = await authorizedFetch("/api/Course/ByUser")
        store.data = await resp.json()
    }

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <Sidebar collapsible="icon" {...props} >
            <SidebarHeader>
                <DashboardSidebarHeaderContent team={data.team} />
            </SidebarHeader>
            <SidebarContent>
                {
                    roles.some(r => r == "User") &&
                    <>
                        <SidebarGroup>
                            <SidebarGroupLabel>Main</SidebarGroupLabel>
                            <SidebarMenu>
                                <DbSidebarMenuItem name={"Class"} url={"/dashboard/info/class"} icon={School} />
                                {/*<DbSidebarMenuItem name={"Attending"} url={"/dashboard/attending-class"} icon={Calendar} />*/}
                            </SidebarMenu>
                        </SidebarGroup>
                                <SidebarGroup>
                    <SidebarGroupLabel>Classes</SidebarGroupLabel>
                    <SidebarMenu>
                        {snap.data.map(d =>
                            <DbSidebarMenuItem key={d.id} name={d.courseName} url={`/dashboard/info/class/${d.id}`} icon={Calendar} />
                        )}
                    </SidebarMenu>
                </SidebarGroup>
                    </>


                }
    

                {
                    roles.some(r => r == "Admin") &&
                    <SidebarGroup>
                        <SidebarGroupLabel>Management</SidebarGroupLabel>
                        <SidebarMenu>
                            <DbSidebarMenuItem name={"Attendee"} url={"/dashboard/attendee"} icon={Speech} />
                            {/*<DbSidebarMenuItem name={"Classroom"} url={"/dashboard/classroom"} icon={LandPlot} />*/}
                            {/*<DbSidebarMenuItem name={"Course Info"} url={"/dashboard/course-info"} icon={BookText} />*/}
                            <DbSidebarMenuItem name={"Course"} url={"/dashboard/course"} icon={NotebookTabs} />
                            <DbSidebarMenuItem name={"Enrollment"} url={"/dashboard/enrollment"} icon={Merge} />
                            <DbSidebarMenuItem name={"Student"} url={"/dashboard/student"} icon={GraduationCap} />
                            <DbSidebarMenuItem name={"Schedule"} url={"/dashboard/schedule"} icon={CalendarPlus} />
                            <DbSidebarMenuItem name={"Teacher"} url={"/dashboard/teacher"} icon={FileUser} />
                            <DbSidebarMenuItem name={"User"} url={"/dashboard/user"} icon={User} />
                            <DbSidebarMenuItem name={"Role"} url={"/dashboard/role"} icon={BadgeCheck} />
                            {/*<DbSidebarMenuItem name={"Test"} url={"/dashboard/test"} icon={Command} />*/}
                            {/*<DbCollapsableItem title={"Collapsed"} isActive={false} >*/}
                            {/*<DbSidebarMenuSubItem title={"Item 1"} url={"#"}/>*/}
                            {/*</DbCollapsableItem>*/}
                        </SidebarMenu>
                    </SidebarGroup>

                }
                {/*<NavMain items={data.navMain} />*/}
                {/*<NavProjects projects={data.projects} />*/}
            </SidebarContent>
            <SidebarFooter>
                {
                    data.user.name === ""
                        ? <Link href="/logout">
                            <Button className="w-full">Log in</Button>
                        </Link>
                        : <NavUser user={data.user} />
                }
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
export { DashboardSidebar }