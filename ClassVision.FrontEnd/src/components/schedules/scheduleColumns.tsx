import { ColumnDef } from "@tanstack/react-table"
import { columnSortable, rowToLocalizedTime, rowToRelativeTime } from "../../utils/dataTableUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ScheduleType } from "../../interfaces/ScheduleTypes";
import { scheduleModifyStore, scheduleDeleteStore } from "../../stores/scheduleStores";
import { CourseInfoType } from "../../interfaces/CourseInfoType";

const store = scheduleModifyStore
const deleteStore = scheduleDeleteStore
const handleDeleteClick = (id: string) => {
    deleteStore.id = id
    deleteStore.opened = true
}
export const scheduleColumns: ColumnDef<ScheduleType>[] = [
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
        accessorKey: "course",
        header: ({ column }) => columnSortable(column, "Course Id"),
        cell: ({ row }) => {
            const course = row.getValue("course") as CourseInfoType
            return course?.id ?? ""
        }
    },
    {
        accessorKey: "date",
        header: ({ column }) => columnSortable(column, "Date")
    },
    {
        accessorKey: "startTime",
        header: ({ column }) => columnSortable(column, "Start")
    },
    {
        accessorKey: "endTime",
        header: ({ column }) => columnSortable(column, "End")
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
                            onClick={() => navigator.clipboard.writeText(data.id)}
                        >
                            Copy ID
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(data.courseId)}
                        >
                            Copy course id
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(data.date)}
                        >
                            Copy date
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                            store.opened = true
                            store.isEdit = true
                            store.data = {
                                ...data,
                                courseId: data.course.id
                            }
                        }}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(data.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

