import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { LoginForm } from "../../components/dashboard/LoginForm"
import DashboardSidebarHeaderContent from "../../components/dashboard/DashboardSidebarHeaderContent"
import { DashboardSidebar } from "../../components/dashboard/DbSidebar"
import DbHeader from "../../components/dashboard/DbHeader"

export default function Page() {
    return (
        <>
            <DbHeader items={[{ name: "Dashboard" }, { name: "Testing", url:"https://youtu.be/dQw4w9WgXcQ"}]} />
            
        </>

    )
}
