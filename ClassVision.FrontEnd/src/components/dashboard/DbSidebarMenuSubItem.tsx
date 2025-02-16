import Link from "next/link"
import { SidebarMenuSubItem, SidebarMenuSubButton } from "../ui/sidebar"

const DbSidebarMenuSubItem = ({title, url }: {
    title: string,
    url: string
}) => {
    return (
        <SidebarMenuSubItem key={title}>
            <SidebarMenuSubButton asChild>
                <Link href={url}>
                    <span>{title}</span>
                </Link>
            </SidebarMenuSubButton>
        </SidebarMenuSubItem>
    )
}

export default DbSidebarMenuSubItem