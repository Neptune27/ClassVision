"use client"

import * as React from "react"
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange } from "react-day-picker"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { ScrollBar } from "./scroll-area"


interface DatePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    date: Date,
    setDate: (date: Date | undefined) => void
}


interface DateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    date: DateRange,
    setDate: (date: DateRange | undefined) => void
}

export interface TimeOnly {
    hour: number,
    minute: number,
    seconds: number
}

interface TimePickerProps extends React.HTMLAttributes<HTMLDivElement> {
    time: TimeOnly | undefined,
    setTime: (date: TimeOnly) => void
}


export function DatePicker(props: DatePickerProps) {
    const {className, date, setDate } = props

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        className
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a time</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}

export function DatePickerWithRange(props: DateRangePickerProps) {
    const { className, date, setDate } = props

    //const [date, setDate] = React.useState<DateRange | undefined>({
    //    from: new Date(),
    //    to: addDays(new Date(), 20),
    //})

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}


export function DateTimePicker(props: DatePickerProps) {
    const { className, date, setDate } = props

    //const [date, setDate] = React.useState<Date>();
    const [isOpen, setIsOpen] = React.useState(false);

    const hours = Array.from({ length: 12 }, (_, i) => i + 1);
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleTimeChange = (
        type: "hour" | "minute" | "ampm",
        value: string
    ) => {
        if (date) {
            const newDate = new Date(date);
            if (type === "hour") {
                newDate.setHours(
                    (parseInt(value) % 12) + (newDate.getHours() >= 12 ? 12 : 0)
                );
            } else if (type === "minute") {
                newDate.setMinutes(parseInt(value));
            } else if (type === "ampm") {
                const currentHours = newDate.getHours();
                newDate.setHours(
                    value === "PM" ? currentHours + 12 : currentHours - 12
                );
            }
            setDate(newDate);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "MM/dd/yyyy hh:mm aa")
                    ) : (
                        <span>MM/DD/YYYY hh:mm aa</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {hours.reverse().map((hour) => (
                                    <Button
                                        key={hour}
                                        size="icon"
                                        variant={
                                            date && date.getHours() % 12 === hour % 12
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("hour", hour.toString())}
                                    >
                                        {hour}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                    <Button
                                        key={minute}
                                        size="icon"
                                        variant={
                                            date && date.getMinutes() === minute
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() =>
                                            handleTimeChange("minute", minute.toString())
                                        }
                                    >
                                        {minute}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="">
                            <div className="flex sm:flex-col p-2">
                                {["AM", "PM"].map((ampm) => (
                                    <Button
                                        key={ampm}
                                        size="icon"
                                        variant={
                                            date &&
                                                ((ampm === "AM" && date.getHours() < 12) ||
                                                    (ampm === "PM" && date.getHours() >= 12))
                                                ? "default"
                                                : "ghost"
                                        }
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("ampm", ampm)}
                                    >
                                        {ampm}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export function DateTimePicker24h(props: DatePickerProps) {
    const { className, date, setDate } = props
    //const [date, setDate] = React.useState<Date>();
    const [isOpen, setIsOpen] = React.useState(false);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleTimeChange = (
        type: "hour" | "minute",
        value: string
    ) => {
        if (date) {
            const newDate = new Date(date);
            if (type === "hour") {
                newDate.setHours(parseInt(value));
            } else if (type === "minute") {
                newDate.setMinutes(parseInt(value));
            }
            setDate(newDate);
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "MM/dd/yyyy hh:mm")
                    ) : (
                        <span>MM/DD/YYYY hh:mm</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {hours.reverse().map((hour) => (
                                    <Button
                                        key={hour}
                                        size="icon"
                                        variant={date && date.getHours() === hour ? "default" : "ghost"}
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("hour", hour.toString())}
                                    >
                                        {hour}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                    <Button
                                        key={minute}
                                        size="icon"
                                        variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("minute", minute.toString())}
                                    >
                                        {minute.toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export function TimePicker24h(props: TimePickerProps) {
    const { className, time, setTime } = props
    //const [date, setDate] = React.useState<Date>();
    const [isOpen, setIsOpen] = React.useState(false);

    const hours = Array.from({ length: 24 }, (_, i) => i);
    //const handleDateSelect = (selectedDate: Date | undefined) => {
    //    if (selectedDate) {
    //        setDate(selectedDate);
    //    }
    //};

    const handleTimeChange = (
        type: "hour" | "minute" | "second",
        value: string
    ) => {
        let newTime: TimeOnly = {
            hour: 0,
            minute: 0,
            seconds: 0
        }

        if (time) {
            newTime = {
                ...time, ...newTime
            }
        }

        if (type === "hour") {
            newTime.hour = parseInt(value);
        } else if (type === "minute") {
            newTime.minute = parseInt(value);
        }
        else {
            newTime.seconds = parseInt(value);
        }
        setTime(newTime);
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-start text-left font-normal",
                        !time && "text-muted-foreground"
                    )}
                >
                    <ClockIcon className="mr-2 h-4 w-4" />
                    {time ? (
                        `${time.hour}:${time.minute}:${time.seconds}`
                    ) : (
                        <span>hh:mm:ss</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <div className="sm:flex">
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {hours.reverse().map((hour) => (
                                    <Button
                                        key={hour}
                                        size="icon"
                                        variant={time && time.hour === hour ? "default" : "ghost"}
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("hour", hour.toString())}
                                    >
                                        {hour}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                                    <Button
                                        key={minute}
                                        size="icon"
                                        variant={time && time.minute === minute ? "default" : "ghost"}
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("minute", minute.toString())}
                                    >
                                        {minute.toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                        <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                                {Array.from({ length: 12 }, (_, i) => i * 5).map((second) => (
                                    <Button
                                        key={second}
                                        size="icon"
                                        variant={time && time.seconds === second ? "default" : "ghost"}
                                        className="sm:w-full shrink-0 aspect-square"
                                        onClick={() => handleTimeChange("second", second.toString())}
                                    >
                                        {second.toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" className="sm:hidden" />
                        </ScrollArea>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}





