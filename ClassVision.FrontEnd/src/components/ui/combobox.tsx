"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

const data = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
]

export type ComboboxData = {
    value: string,
    label: string,
    //icon?: string
}

export function Combobox(props: {
    value: string,
    onValueChange: (value: string) => void,
    data: ComboboxData[],
    open?: boolean,
    onOpenChange?: (open: boolean) => void,
    className: string,
    modal?: boolean,
    disable?: boolean
}) {
    const { value, onValueChange, data, className, modal, disable } = props
    const [open, setOpen] = React.useState(false)

    return (
        <Popover modal={modal} open={props.open ?? open} onOpenChange={props.onOpenChange ?? setOpen}>
            <PopoverTrigger asChild>
                <Button disabled={disable}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={`${className} justify-between`}
                >
                    {value
                        ? data.find((datum) => datum.value === value)?.label
                        : "Select value..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`${className} p-0` }>
                <Command>
                    <CommandInput placeholder="Search..." className="h-9" />
                    <CommandList>
                        <CommandEmpty>No data found.</CommandEmpty>
                        <CommandGroup>
                            {data.map((datum) => (
                                <CommandItem
                                    key={datum.value}
                                    value={datum.value}
                                    onSelect={(currentValue) => {
                                        onValueChange(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {datum.label}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === datum.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
