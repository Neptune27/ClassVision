"use client"

import { useSnapshot } from "valtio"
import { rollCallHubStore, rollCallStore } from "../../stores/rollcallStores";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { isInSelected } from "../courses/CourseStudentPopover";
import { useEffect, useState } from "react";
import { StudentType } from "../../interfaces/StudentTypes";
import { Check } from "lucide-react";
import { cn, getDisplayId } from "../../lib/utils";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { EFaceStatus, ImageFaceType } from "../../interfaces/ImageFaceType";
import { AttendeeType, EAttendantStatus } from "../../interfaces/AttendeeTypes";
import { handleEdit } from "./attendeeWithNameColumns";

export function FaceStudentPopoverContent({ id, imagePosition }: {
    id: string,
    imagePosition: number
}) {
    const store = rollCallStore;
    const hubStore = rollCallHubStore;

    const snap = useSnapshot(store)
    const [students, setStudents] = useState<AttendeeType[]>(store.attentee)
    const data = snap.data[0]
    const [all, setAll] = useState(false)

    const filterAttendeeNotIn = () => {
        if (all) {
            return store.attentee
        }

        const selectedStudentIds = data.faces.filter(f => f.status == EFaceStatus.SELECTED).map(f => f.user_id)

        const student = store.attentee.filter(u => !selectedStudentIds.includes(u.studentId))
        return student
    }

    useEffect(() => {
        setStudents(filterAttendeeNotIn())
    }, [data.faces])

    useEffect(() => {
        setStudents(filterAttendeeNotIn())
    }, [all])

    const handleUpdateAttendee = (attendee: AttendeeType) => {
        attendee.status = EAttendantStatus.PRESENT
        //handleEdit(attendee)

        const data = store.data[imagePosition]
        const facePosition = data.faces.find(f => f.id == id)
        if (!facePosition) {
            console.log("Wtf")
            return
        }

        console.log(facePosition)
        facePosition.status = EFaceStatus.SELECTED
        facePosition.user_id = attendee.enrollment?.studentId

        handleSignal(data.path, facePosition)
    }

    const handleSignal = (path: string, facePosition: ImageFaceType) => {
        hubStore.hub?.invoke("UpdateData", path, facePosition.id.toString(), JSON.stringify({ ...facePosition, id: facePosition.id.toString() }));
    }

    return (
        <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <div className="flex flex-row-reverse m-2 gap-2">
                <Label htmlFor="all" className="text-center ">All</Label>
                <Checkbox id="all" checked={all} onClick={() => {
                    setAll(!all)
                }} />
            </div>
            <CommandList>
                <CommandEmpty>No student found.</CommandEmpty>
                <CommandGroup>
                    {students.map((datum, i) => (
                        <CommandItem key={i}
                            key={datum.enrollment?.studentId}
                            value={`${datum.enrollment.studentId} | ${datum.enrollment.student.firstName} ${datum.enrollment.student.firstName}`}
                            onSelect={(currentValue) => {
                                const id = getDisplayId(currentValue);
                                const student = store.attentee.find((v) => v.enrollment?.studentId == id)
                                if (!student) {
                                    console.log("Student not found???")
                                    return
                                }

                                handleUpdateAttendee(student);

                                //setSelectedData(currentValue)
                                //setOpen(false)
                            }}
                        >
                            {datum.enrollment.studentId} | {datum.enrollment.student.firstName} {datum.enrollment.student.lastName}
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