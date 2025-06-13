"use client"

import { useSnapshot } from "valtio"
import { rollCallHubStore, rollCallStore } from "../../stores/rollcallStores";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { isInSelected } from "../courses/CourseStudentPopover";
import { useEffect, useState } from "react";
import { ClassUserType } from "../../interfaces/ClassUserTypes";
import { Check } from "lucide-react";
import { cn, getDisplayId } from "../../lib/utils";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { EFaceStatus, ImageFaceType } from "../../interfaces/ImageFaceType";
import { AttendeeType, EAttendantStatus } from "../../interfaces/AttendeeTypes";
import { handleAttendeeEdit } from "./attendeeWithNameColumns";
import { Button } from "../ui/button";

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
        const current = data.faces.find(f => f.id == id)
        const student = store.attentee.filter(u => current?.user_id == u.studentId || !selectedStudentIds.includes(u.studentId))
        return student
    }

    useEffect(() => {
        setStudents(filterAttendeeNotIn())
    }, [data.faces])

    useEffect(() => {
        setStudents(filterAttendeeNotIn())
    }, [all])

    const handleUpdateAttendee = (attendee: AttendeeType, status: EAttendantStatus) => {
        attendee.status = status
        //handleEdit(attendee)

        const data = store.data[imagePosition]

        const oldFacePosition = data.faces.find(f => f.user_id == attendee.enrollment?.studentId)

        const newFacePosition = data.faces.find(f => f.id == id)
        if (!newFacePosition) {
            console.log("Wtf")
            return
        }

        console.log(newFacePosition)
        newFacePosition.status = EFaceStatus.SELECTED
        newFacePosition.user_id = attendee.enrollment?.studentId

        handleSignal(data.path, newFacePosition)


        if (!oldFacePosition) {
            return
        }

        //if (oldFacePosition == newFacePosition) {
        //    return
        //}

        oldFacePosition.status = EFaceStatus.NOT_SELECTED
        oldFacePosition.user_id = undefined
        handleSignal(data.path, oldFacePosition)



    }

    const handleSignal = (path: string, facePosition: ImageFaceType) => {
        hubStore.hub?.invoke("UpdateData", path, facePosition.id.toString(), JSON.stringify({ ...facePosition, id: facePosition.id.toString() }));
    }

    const handleDeselect = () => {
        const current = store.data[imagePosition].faces.find(f => f.id == id)

        if (!current) return

        const attendee = store.attentee.find((v) => v.enrollment?.studentId == current.user_id)

        if (!attendee) return

        handleUpdateAttendee(attendee, EAttendantStatus.ABSENT)
    }

    return (
        <Command>
            <CommandInput placeholder="Search..." className="h-9" />
            <div className="flex justify-between m-2 gap-2">
                <Button variant="destructive" onClick={handleDeselect}>Deselect
                </Button>
                <div>
                    <Checkbox id="all" checked={all} onClick={() => {
                        setAll(!all)
                    }} />
                    <Label htmlFor="all" className="text-center ">All</Label>

                </div>
            </div>
            <CommandList>
                <CommandEmpty>No student found.</CommandEmpty>
                <CommandGroup>
                    {students.map((datum, i) => (
                        <CommandItem key={i}
                            key={datum.enrollment?.studentId}
                            value={`${datum.enrollment.studentId} | ${datum.enrollment.student.firstName} ${datum.enrollment.student.lastName}`}
                            onSelect={(currentValue) => {
                                const id = datum.enrollment?.studentId;
                                const student = store.attentee.find((v) => v.enrollment?.studentId == id)
                                if (!student) {
                                    console.log("Student not found???")
                                    return
                                }

                                handleUpdateAttendee(student, EAttendantStatus.PRESENT);

                                //setSelectedData(currentValue)
                                //setOpen(false)
                            }}
                        >
                            {datum.enrollment.student.firstName} {datum.enrollment.student.lastName}
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