"use client"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    Row,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "./button"
import React, { useEffect } from "react"
import { Input } from "./input"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    filter?: boolean,
    filterId?: string,
    visible?: boolean,
    initialVisibility?: {
        [K in keyof TData]?: boolean
    },
    visibleName?: {
        [K in keyof TData | string]?: string

    },
    setSelectedRow?: (rows: Row<TData>[]) => void,
    children?: React.ReactNode
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
    const {
        columns,
        data,
        filterId,
        setSelectedRow,
        visibleName
    } = props

    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )

    const initialVisibility = props.initialVisibility ?? {}

    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(initialVisibility)


    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection
        },
    })
    useEffect(() => {
        console.log(rowSelection)
        if (setSelectedRow) {
            setSelectedRow(table.getFilteredSelectedRowModel().rows)
        }
    }, [rowSelection])


    return (
        <div>
            {(props.filter || props.visible) &&
                <div className="flex items-center py-4">
                    {props.filter &&
                        <Input
                            placeholder="Filter..."
                            value={(table.getColumn(filterId ?? "")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(filterId ?? "")?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm"
                        />
                    }
                    {props.children}
                    {props.visible &&
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Columns
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter(
                                        (column) => column.getCanHide()
                                    )
                                    .map((column) => {
                                        let name = column.id

                                        if (visibleName) {
                                            const key = column.id;
                                            name = visibleName[key] ?? name
                                        }

                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(!!value)
                                                }
                                            >
                                                {name}
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }
                </div>
            }
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
            {/*<div className="flex-1 text-sm text-muted-foreground">*/}
            {/*    {table.getFilteredSelectedRowModel().rows.length} of{" "}*/}
            {/*    {table.getFilteredRowModel().rows.length} row(s) selected.*/}
            {/*</div>*/}
        </div>
    )
}

