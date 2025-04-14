import { ColumnDef } from "@tanstack/react-table"
import { columnSortable, rowToLocalizedTime, rowToRelativeTime } from "../../utils/dataTableUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { CourseType } from "../../interfaces/CourseTypes";
import { courseModifyStore, courseDeleteStore } from "../../stores/courseStores";
import { CourseInfoType } from "../../interfaces/CourseInfoType";

const store = courseModifyStore
const deleteStore = courseDeleteStore
const handleDeleteClick = (id: string) => {
    deleteStore.id = id
    deleteStore.opened = true
}
export const courseColumns: ColumnDef<CourseType>[] = [
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
        accessorKey: "courseInfo",
        header: ({ column }) => columnSortable(column, "Info"),
        cell: ({ row }) => {
            const data = row.getValue("courseInfo") as CourseInfoType

            return `${data.id} | ${data.name}`

        }
    },
    {
        accessorKey: "teacherId",
        header: ({ column }) => columnSortable(column, "Teacher Id")

    },
    {
        accessorKey: "classroomId",
        header: ({ column }) => columnSortable(column, "Room")
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
                            onClick={() => navigator.clipboard.writeText(data.teacher.id)}
                        >
                            Copy teacher id
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(data.courseName.id)}
                        >
                            Copy course info id
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                            store.opened = true
                            store.isEdit = true
                            store.data = {
                                id: data.id,
                                period: 1,
                                attendantId: [],
                                classroomId: data.classroom.roomId,
                                courseInfoId: data.courseName.id,
                                schedules: data.schedules.map(s => {
                                    return ({
                                        ...s,
                                        period: 1
                                    })
                                }),
                                studentIds: data.enrollments.map(e => e.studentId),
                                teacherId: data.teacher.id
                            }
                        }}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(data.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

