import { LucideIcon } from "lucide-react"
import { SidebarMenuItem, SidebarMenuButton } from "../ui/sidebar"
import Link from "next/link"

const DbSidebarMenuItem = (props: {
    name: string,
    url: string,
    icon?: LucideIcon
}) => {

    return (
        <SidebarMenuItem key={props.name}>
            <SidebarMenuButton asChild>
                <Link href={props.url}>
                    {props.icon && <props.icon />}
                    <span>{props.name}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export default DbSidebarMenuItem