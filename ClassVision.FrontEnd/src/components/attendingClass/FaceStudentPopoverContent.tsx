"use client"

import { useSnapshot } from "valtio"
import { rollcallStore } from "../../stores/rollcallStores";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { isInSelected } from "../courses/CourseStudentPopover";
import { useEffect, useState } from "react";
import { StudentType } from "../../interfaces/StudentTypes";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { EFaceStatus } from "../../interfaces/ImageFaceType";

export function FaceStudentPopoverContent({ }: {
    id: string,
    imagePosition: number
}) {
    const store = rollcallStore;
    const snap = useSnapshot(store)
    const [students, setStudents] = useState<StudentType[]>(store.userData)
    const data = snap.data[0]
    const [all, setAll] = useState(false)

    const filterStudentNotIn = () => {
        if (all) {
            return store.userData
        }

        const selectedStudentIds = data.faces.filter(f => f.status == EFaceStatus.SELECTED).map(f => f.user_id)

        const student = store.userData.filter(u => !selectedStudentIds.includes(u.id))
        return student
    }

    useEffect(() => {
        setStudents(filterStudentNotIn())
    }, [data.faces])

    return (
        <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <div className="flex flex-row-reverse m-2 gap-2">
                <Label htmlFor="all" className="text-center ">All</Label>
                <Checkbox id="all" />
            </div>
            <CommandList>
                <CommandEmpty>No student found.</CommandEmpty>
                <CommandGroup>
                    {students.map((datum, i) => (
                        <CommandItem key={ i }
                            key={datum.id}
                            value={`${datum.id} | ${datum.firstName} ${datum.lastName}`}
                            onSelect={(currentValue) => {
                                console.log(currentValue)
                                //setSelectedData(currentValue)
                                //setOpen(false)
                            }}
                        >
                            {datum.id} | {datum.firstName} {datum.lastName}
                            {/*<Check*/}
                            {/*    className={cn(*/}
                            {/*        "ml-auto",*/}
                            {/*        value === datum.value ? "opacity-100" : "opacity-0"*/}
                            {/*    )}*/}
                            {/*/>*/}
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    )
}