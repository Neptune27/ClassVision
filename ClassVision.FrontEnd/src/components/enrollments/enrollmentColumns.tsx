import { ColumnDef } from "@tanstack/react-table"
import { columnSortable, rowToLocalizedTime, rowToRelativeTime } from "../../utils/dataTableUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { EnrollmentType } from "../../interfaces/EnrollmentTypes";
import { enrollmentModifyStore, enrollmentDeleteStore } from "../../stores/enrollmentStores";

const store = enrollmentModifyStore
const deleteStore = enrollmentDeleteStore
const handleDeleteClick = (id: string) => {
    deleteStore.id = id
    deleteStore.opened = true
}
export const enrollmentColumns: ColumnDef<EnrollmentType>[] = [
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
        accessorKey: "studentId",
        header: ({ column }) => columnSortable(column, "Student Id")
    },
    {
        accessorKey: "courseId",
        header: ({ column }) => columnSortable(column, "Course Id")
    },
 
    {
        accessorKey: "lastUpdated",
        //header: "Last Updated",
        header: ({ column }) => columnSortable(column, "Last Updated"),
        cell: ({ row }) => rowToRelativeTime(row, "lastUpdated")

    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => columnSortable(column, "Created At"),
        cell: ({ row }) => rowToRelativeTime(row, "createdAt")
    },
    {
        accessorKey: "isActive",
        header: ({ column }) => columnSortable(column, "Active?"),

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
                            onClick={() => navigator.clipboard.writeText(data.studentId)}
                        >
                            Copy student Id
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(data.courseId)}
                        >
                            Copy course id
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {/*<DropdownMenuItem onClick={() => {*/}
                        {/*    store.opened = true*/}
                        {/*    store.isEdit = true*/}
                        {/*    store.data = {*/}
                        {/*        ...data*/}
                        {/*    }*/}
                        {/*}}>Edit</DropdownMenuItem>*/}
                        <DropdownMenuItem onClick={() => handleDeleteClick(`${data.courseId}|${data.studentId}`)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

