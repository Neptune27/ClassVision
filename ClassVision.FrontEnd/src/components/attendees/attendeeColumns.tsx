import { ColumnDef } from "@tanstack/react-table"
import { columnSortable, rowToLocalizedTime, rowToRelativeTime } from "../../utils/dataTableUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { AttendeeType, EAttendantStatus } from "../../interfaces/AttendeeTypes";
import { attendeeModifyStore, attendeeDeleteStore } from "../../stores/attendeeStores";
import { EGender } from "../../interfaces/TeacherTypes";

const store = attendeeModifyStore
const deleteStore = attendeeDeleteStore
const handleDeleteClick = (id: string) => {
    deleteStore.id = id
    deleteStore.opened = true
}
export const attendeeColumns: ColumnDef<AttendeeType>[] = [
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
        enableColumnFilter: false
    },
    {
        accessorKey: "id",
        header: ({ column }) => columnSortable(column, "Id")
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
        accessorKey: "scheduleId",
        header: ({ column }) => columnSortable(column, "Schedule Id")
    },
    {
        accessorKey: "status",
        header: ({ column }) => columnSortable(column, "Status"),
        cell: ({ row }) => {
            const current = row.getValue("status") as EAttendantStatus
            switch (current) {
                case EAttendantStatus.PRESENT:
                    return "Present (M)";
                case EAttendantStatus.AUTOMATED:
                    return "Present (A)";
                case EAttendantStatus.ABSENT:
                    return "Absent"
                case EAttendantStatus.LATE:
                    return "Late"
                case EAttendantStatus.EXCUSED:
                    return "Excused"
                case EAttendantStatus.OTHER:
                    return "Other"
            }
        }
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
        enableColumnFilter: false,
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
                        <DropdownMenuItem onClick={() => {
                            store.opened = true
                            store.isEdit = true
                            store.data = {
                                ...data
                            }
                        }}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(`${data.courseId}|${data.studentId}|${data.scheduleId}`)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

