import { Column, Row } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { DateTime } from "luxon";
import { Button } from "../components/ui/button";
import exp from "node:constants";

export function rowToRelativeTime<T>(row: Row<T>, columnName: string) {
    const date = DateTime.fromISO(row.getValue(columnName))
    return (date.toRelative())
}

export function rowToLocalizedTime<T>(row: Row<T>, columnName: string) {
    const date = DateTime.fromISO(row.getValue(columnName))
    return (date.toLocaleString())
}

export function columnSortable<T>(column: Column<T>, name: string) {
    return (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            {name}
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    )
}