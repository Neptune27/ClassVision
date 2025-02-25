import React from "react";
import { ComboboxData } from "../ui/combobox";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "../../lib/utils";
import { Checkbox } from "../ui/checkbox";
import { StudentType } from "../../interfaces/StudentTypes";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";


export const getDisplayId = (display: string) => {
    return display.split("|")[0].trim();

}

export const isSelected = (real: string, display: string) => {
    return real === getDisplayId(display)
}

export const isInSelected = (realData: string[], display: string) => {
    return realData.some((datum) => isSelected(datum, display))
}

export function CourseStudentPopover(props: {
    selectedData: readonly string[],
    setSelectedData: (newData: string) => void
    data: {
        data: StudentType[],
        display: ComboboxData[]
    },
    className: string,
    open?: boolean,
    onOpenChange?: (open: boolean) => void,

}) {
    const { selectedData, setSelectedData, data, className } = props
    const [open, setOpen] = React.useState(false)

    return (
        <Popover open={props.open ?? open} onOpenChange={props.onOpenChange ?? setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`${className} justify-between`}
                >
                    Select student...
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`${className} p-0`}>
                <Command>
                    <CommandInput placeholder="Search..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No student found.</CommandEmpty>
                        <CommandGroup>
                            {data.display.map((datum) => (
                                <CommandItem
                                    key={datum.value}
                                    value={datum.value}
                                    onSelect={(currentValue) => {
                                        console.log(currentValue)
                                        setSelectedData(currentValue)
                                        //setOpen(false)
                                    }}
                                >
                                    <Checkbox
                                        checked={isInSelected(selectedData, datum.label)}
                                    />
                                    {datum.label}

                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
    return (<>

    </>
    );
}