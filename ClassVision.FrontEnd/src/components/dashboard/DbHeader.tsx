import { Fragment } from "react";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "../ui/breadcrumb";
import { Separator } from "../ui/separator";
import { SidebarTrigger } from "../ui/sidebar";

export default function DbHeader({ items }: {
    items: {
        name: string,
        url?: string
    }[]
}) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        {items.map((item, index) => (<Fragment key={item.name + "fm" }>
                            <BreadcrumbItem key={item.name + "br"} className={"hidden md:block"}>
                                <BreadcrumbLink href={item.url} key={item.name + ""}>
                                    {index < items.length - 1 ? item.name :
                                        <BreadcrumbPage>{item.name}</BreadcrumbPage>    
                                    }
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            {index < items.length - 1 &&
                                <BreadcrumbSeparator key={item.name + "sp"} className="hidden md:block" />
                            }
                        </Fragment>))}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </header>
    )
}
