import { Column, ColumnDef } from "@tanstack/react-table"
import { columnSortable, rowToLocalizedTime, rowToRelativeTime } from "@/utils/dataTableUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ClassInfoType, StudentClassInfoType } from "../../../interfaces/ClassInfoType";
import { EAttendantStatus, EAttendantStatusToString, StringToEAttendantStatus } from "../../../interfaces/AttendeeTypes";
import { Combobox } from "../../ui/combobox";
import { eAttendantCBData, handleAttendeeEdit } from "../../attendingClass/attendeeWithNameColumns";

export const classDetailsDefaultColumns: ColumnDef<StudentClassInfoType>[] = [
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
        accessorKey: "student.id",
        header: ({ column }) => columnSortable(column, "Student Id")
    },
    {
        accessorKey: "student.firstName",
        header: ({ column }) => columnSortable(column, "First Name")
    },
    {
        accessorKey: "student.lastName",
        header: ({ column }) => columnSortable(column, "Last Name")
    },
    //{
    //    id: "action",
    //    enableColumnFilter: false,
    //    cell: ({ row }) => {
    //        const data = row.original

    //        return (
    //            <DropdownMenu>
    //                <DropdownMenuTrigger asChild>
    //                    <Button variant="ghost" className="h-8 w-8 p-0">
    //                        <span className="sr-only">Open menu</span>
    //                        <MoreHorizontal className="h-4 w-4" />
    //                    </Button>
    //                </DropdownMenuTrigger>
    //                <DropdownMenuContent align="end">
    //                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                    <DropdownMenuItem
    //                        onClick={() => navigator.clipboard.writeText(data.student.id)}
    //                    >
    //                        Copy student Id
    //                    </DropdownMenuItem>
    //                    {/*<DropdownMenuItem*/}
    //                    {/*    onClick={() => navigator.clipboard.writeText(data.courseId)}*/}
    //                    {/*>*/}
    //                    {/*    Copy course id*/}
    //                    {/*</DropdownMenuItem>*/}
    //                    {/*<DropdownMenuSeparator />*/}
    //                    {/*<DropdownMenuItem onClick={() => {*/}
    //                    {/*    store.opened = true*/}
    //                    {/*    store.isEdit = true*/}
    //                    {/*    store.data = {*/}
    //                    {/*        ...data*/}
    //                    {/*    }*/}
    //                    {/*}}>Edit</DropdownMenuItem>*/}
    //                    {/*<DropdownMenuItem onClick={() => handleDeleteClick(`${data.courseId}|${data.studentId}|${data.scheduleId}`)}>Delete</DropdownMenuItem>*/}
    //                </DropdownMenuContent>
    //            </DropdownMenu>
    //        )
    //    }
    //}
]

export const createColumns = (studentDef: StudentClassInfoType) => {
    const colsDef = [...classDetailsDefaultColumns]


    const totalCol: ColumnDef<StudentClassInfoType> = {
        accessorKey: "Total",
        header: ({ column }) => columnSortable(column, `Total`),
        cell: ({ row }) => `${row.original.attendants.filter(a => a.status !== EAttendantStatus.ABSENT).length}/${row.original.attendants.length}`
    }

    const generated = studentDef.attendants.map((a, i) => {
        const data: ColumnDef<StudentClassInfoType> = {
            accessorKey: `W${i + 1}`,
            header: ({ column }) => columnSortable(column, `W${i+1}`),
            cell: ({ row }) => {
                const current = row.original.attendants[i]
                return (
                    <Combobox value={EAttendantStatusToString(current.status)} onValueChange={(value) => {
                        handleAttendeeEdit({
                            id: current.id,
                            courseId: current.courseId,
                            scheduleId: current.scheduleId,
                            studentId: current.studentId,
                            status: StringToEAttendantStatus(value)
                        })
                    }} data={eAttendantCBData} className={""}
                    />
                )
            }
        }

        

        return data
    })

    colsDef.push(totalCol, ...generated)
    return colsDef
}