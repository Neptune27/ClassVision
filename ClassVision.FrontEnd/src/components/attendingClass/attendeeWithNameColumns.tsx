import { ColumnDef } from "@tanstack/react-table"
import { columnSortable, rowToLocalizedTime, rowToRelativeTime } from "../../utils/dataTableUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { AttendeeModifyType, AttendeeType, EAttendantStatus, EAttendantStatusToString, StringToEAttendantStatus } from "../../interfaces/AttendeeTypes";
import { attendeeModifyStore, attendeeDeleteStore } from "../../stores/attendeeStores";
import { Combobox, ComboboxData } from "../ui/combobox";
import { authorizedFetch } from "../../utils/authorizedFetcher";
import { triggerFetch } from "../../lib/utils";
import { rollCallStore } from "../../stores/rollcallStores";

const store = attendeeModifyStore
const deleteStore = attendeeDeleteStore
const handleDeleteClick = (id: string) => {
    deleteStore.id = id
    deleteStore.opened = true
}
export const eAttendantCBData : ComboboxData[] = [{
    label: "Present",
    value: "Present"
},
{
    label: "Absent",
    value: "Absent"
},
{
    label: "Late",
    value: "Late"
},
{
    label: "Excused",
    value: "Excused"
},
{
    label: "Other",
    value: "Other"
},
]


export const handleAttendeeEdit = async (sentData: AttendeeModifyType, refresh = true) => {
    const url = `/api/Attendee`
    const resp = await authorizedFetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(sentData)
    })

    const data = await resp.text()
    console.log(data)
    if (refresh) {
        triggerFetch(rollCallStore)
    }
}
export const attendeeWithNameColumns: ColumnDef<AttendeeType>[] = [
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
        accessorKey: "studentId",
        header: ({ column }) => columnSortable(column, "Student Id")
    },
    {
        accessorKey: "courseId",
        header: ({ column }) => columnSortable(column, "Course Id")
    },
    {
        accessorKey: "enrollment.student.firstName",
        header: ({ column }) => columnSortable(column, "Firstname")
    },
    {
        accessorKey: "enrollment.student.lastName",
        header: ({ column }) => columnSortable(column, "Lastname")
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
            return (
                <Combobox value={EAttendantStatusToString(current)} onValueChange={(value) => {
                    handleAttendeeEdit({
                        id: row.getValue("id"),
                        courseId: row.getValue("courseId"),
                        scheduleId: row.getValue("scheduleId"),
                        studentId: row.getValue("studentId"),
                        status: StringToEAttendantStatus(value)
                    })
                }} data={eAttendantCBData} className={""}
                />
            )
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

