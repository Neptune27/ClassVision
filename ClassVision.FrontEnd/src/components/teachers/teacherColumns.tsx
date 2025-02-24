import { ColumnDef } from "@tanstack/react-table"
import { columnSortable, rowToLocalizedTime, rowToRelativeTime } from "../../utils/dataTableUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { EGender, TeacherType } from "../../interfaces/TeacherTypes";
import { teacherModifyStore, teacherDeleteStore } from "../../stores/teacherStores";

const store = teacherModifyStore
const deleteStore = teacherDeleteStore
const handleDeleteClick = (id: string) => {
    deleteStore.id = id
    deleteStore.opened = true
}
export const teacherColumns: ColumnDef<TeacherType>[] = [
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
        accessorKey: "media",
        header: ({ column }) => columnSortable(column, "Profile")
    },
    {
        accessorKey: "firstName",
        header: ({ column }) => columnSortable(column, "First Name")

    },
    {
        accessorKey: "lastName",
        header: ({ column }) => columnSortable(column, "Last Name")
    },
    {
        accessorKey: "gender",
        header: ({ column }) => columnSortable(column, "Gender"),
        cell: ({ row }) => {
            const current = row.getValue("gender") as EGender
            switch (current) {
                case EGender.OTHER:
                    return "Other"
                case EGender.FEMALE:
                    return "Female"
                case EGender.MALE:
                    return "Male"

            }
        }
    },
    {
        accessorKey: "phoneNumber",
        header: ({ column }) => columnSortable(column, "Phone"),
        
    },
    {
        accessorKey: "birthday",
        header: ({ column }) => columnSortable(column, "Birthday"),
        cell: ({ row }) => rowToLocalizedTime(row, "birthday")
    },
    {
        accessorKey: "hireDate",
        header: ({ column }) => columnSortable(column, "Hire Date"),
        cell: ({ row }) => rowToLocalizedTime(row, "hireDate")
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
                            onClick={() => navigator.clipboard.writeText(data.firstName)}
                        >
                            Copy first name
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(data.lastName)}
                        >
                            Copy last name
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(`${data.firstName} ${data.lastName}`)}
                        >
                            Copy name
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => {
                            store.opened = true
                            store.isEdit = true
                            console.log(data.gender)
                            store.data = {
                                id: data.id,
                                address: data.address,
                                birthday: data.birthday,
                                hireDate: data.hireDate,
                                firstName: data.firstName,
                                gender: data.gender,
                                lastName: data.lastName,
                                userId: data.userId,
                                phoneNumber: data.phoneNumber
                            }
                        }}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(data.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

