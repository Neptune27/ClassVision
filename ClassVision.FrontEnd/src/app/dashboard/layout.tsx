import { ReactNode } from "react";
import { DashboardSidebar } from "../../components/dashboard/DbSidebar";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../../components/ui/breadcrumb";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../../components/ui/sidebar";
import { Separator } from "../../components/ui/separator";

export default function DashboardLayout({ children }: {
    children: ReactNode
}) {
    return (
        <SidebarProvider>
            <DashboardSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}