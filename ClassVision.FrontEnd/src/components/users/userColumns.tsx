import { ColumnDef } from "@tanstack/react-table"
import { columnSortable, rowToLocalizedTime, rowToRelativeTime } from "../../utils/dataTableUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { UserType } from "../../interfaces/UserTypes";
import { userModifyStore, userDeleteStore } from "../../stores/userStores";
import { CourseInfoType } from "../../interfaces/CourseInfoType";

const store = userModifyStore
const deleteStore = userDeleteStore
const handleDeleteClick = (id: string) => {
    deleteStore.id = id
    deleteStore.opened = true
}
export const userColumns: ColumnDef<UserType>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: ({ column }) => columnSortable(column, "Id")
    },
    {
        accessorKey: "userName",
        header: ({ column }) => columnSortable(column, "Username"),
    },
    {
        accessorKey: "email",
        header: ({ column }) => columnSortable(column, "Email"),
    },
    {
        accessorKey: "password",
        header: ({ column }) => columnSortable(column, "Password"),
        cell: ({row}) => "Encrypted"
    },
    {
        id: "action",
        cell: ({ row }) => {
            const data = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(data.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/*<DropdownMenuItem onClick={() => {*/}
                        {/*    store.opened = true*/}
                        {/*    store.isEdit = true*/}
                        {/*    store.data = {*/}
                        {/*        ...data,*/}
                        {/*        courseId: data.course.id*/}
                        {/*    }*/}
                        {/*}}>Edit</DropdownMenuItem>*/}
                        <DropdownMenuItem onClick={() => handleDeleteClick(data.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

