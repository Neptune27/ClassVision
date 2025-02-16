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
            <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                    <div className="aspect-video rounded-xl bg-muted/50" />
                </div>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
            </div>
        </>

    )
}
