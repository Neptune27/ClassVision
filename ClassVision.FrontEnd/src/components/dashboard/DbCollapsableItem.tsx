import { ChevronRight, LucideIcon } from "lucide-react"
import { SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "../ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"

const DbCollapsableItem = (props: {
    title: string,
    isActive: boolean,
    icon?: LucideIcon,
    imgIcon?: string,
    children?: React.ReactNode
}) => {
    const { isActive, title, imgIcon, children } = props;

    return (
        <Collapsible
            key={title}
            asChild
            defaultOpen={isActive}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={title}>
                        {props.icon && <props.icon /> }
                        <span>{title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {children}
                        {/*{items?.map((subItem) => (*/}
                        {/*    <SidebarMenuSubItem key={subItem.title}>*/}
                        {/*        <SidebarMenuSubButton asChild>*/}
                        {/*            <a href={subItem.url}>*/}
                        {/*                <span>{subItem.title}</span>*/}
                        {/*            </a>*/}
                        {/*        </SidebarMenuSubButton>*/}
                        {/*    </SidebarMenuSubItem>*/}
                        {/*))}*/}
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}


export default DbCollapsableItem