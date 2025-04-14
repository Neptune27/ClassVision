"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { useEffect, useState } from "react"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { DeleteDialog } from "../dialogs/DeleteDialog"
import { EnrollmentModifyType } from "../../interfaces/EnrollmentTypes"
import { enrollmentDeleteStore, enrollmentBatchDeleteStore, enrollmentModifyStore, enrollmentStore } from "../../stores/enrollmentStores"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DatePicker } from "../ui/date-picker"
import { format } from "date-fns"
import { Combobox, ComboboxData } from "../ui/combobox"
import { DateTimePicker } from "../ui/datetime-picker"
import { getDisplayId, triggerFetch } from "../../lib/utils"
import { CourseInfoType } from "../../interfaces/CourseInfoType"
import { CourseType } from "../../interfaces/CourseTypes"
import { EGender } from "../../interfaces/TeacherTypes"
import { Card, CardContent } from "../ui/card"
import { Button } from "react-day-picker"
import { SimpleTimePicker } from "../ui/simple-time-picker"
import { DateTime } from "luxon"
import { ClassUserType } from "../../interfaces/ClassUserTypes"


const baseUrl = "/api/Enrollment"
const courseUrl = "/api/Course"
const studentUrl = "/api/Student"

export function EnrollmentDeleteDialog() {
    const store = enrollmentDeleteStore;
    const snap = useSnapshot(store)

    const handleOpen = (open: boolean) => {
        store.opened = open
    }


    const handleSubmit = async () => {
        console.log(store)
        const url = `${baseUrl}/${store.id}`
        const resp = await authorizedFetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            }
        })
        const data = await resp.text()
        console.log(data)
        triggerFetch(enrollmentStore)
    }

    return (
        <DeleteDialog open={snap.opened} title={"Are you sure you want to delete this"}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}


export function EnrollmentBatchDeleteDialog() {
    const store = enrollmentBatchDeleteStore
    const snap = useSnapshot(store)

    const handleOpen = (open: boolean) => {
        store.opened = open
    }


    const handleSubmit = async () => {
        console.log(store)
        const promisedResps = snap.ids.map(id => {
            const url = `${baseUrl}/${id}`
            return authorizedFetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8'
                }
            })
        })

        const resps = await Promise.all(promisedResps)

        console.log(resps.map((resp) => resp.status))
        triggerFetch(enrollmentStore)

    }

    return (
        <DeleteDialog open={snap.opened} title={`Are you sure you want to delete ${snap.ids.length} item(s)`}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}


export function EnrollmentDialog({ isEdit }: {
    isEdit: boolean
}) {
    const store = enrollmentModifyStore

    const snap = useSnapshot(store)

    const [title, setTitle] = useState("")
    const [courses, setCoursesData] = useState<{
        data: CourseInfoType[],
        display: ComboboxData[]
    }>({
        data: [],
        display: []
    })

    const [studentData, setStudentData] = useState<{
        data: ClassUserType[],
        display: ComboboxData[]
    }>({
        data: [],
        display: []
    })


    useEffect(() => {
        setTitle(snap.isEdit ? "Edit" : "Create")
    }, [snap.isEdit])

    const handleOpen = (open: boolean) => {
        store.opened = open
    }

    const handleEdit = async (sentData: EnrollmentModifyType) => {
        const url = `${baseUrl}/${snap.data.courseId}|${snap.data.studentId}`
        console.log(url)
        const resp = await authorizedFetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sentData)
        })

        if (!resp.ok) {
            throw await resp.text()
        }

        console.log(resp.status)
        store.opened = false
    }

    const handleCreate = async (sentData: EnrollmentModifyType) => {
        const url = `${baseUrl}`
        console.log(url)
        const resp = await authorizedFetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sentData)
        })

        if (!resp.ok) {
            throw await resp.text()
        }

        console.log(resp.status)
        store.opened = false
    }


    const handleSubmit = async () => {
        console.log(store)
        const data = {
            ...snap.data
        }

        data.courseId = getDisplayId(data.courseId)

        isEdit ? await handleEdit(data) : await handleCreate(data);
        triggerFetch(enrollmentStore)
    }


    useEffect(() => {
        if (!snap.opened) {
            return
        }

        const fetchData = async () => {
            const resp = await authorizedFetch(`${courseUrl}/`)
            const data = await resp.json()

            const result = data.map((datum: CourseType) => {
                const value = `${datum.id} | ${datum.teacher.id} ${datum.classroom.roomId}`

                return ({
                    value: value,
                    label: value
                })
            })

            setCoursesData({
                data: data,
                display: result
            })
        }


        const fetchStudents = async () => {
            const resp = await authorizedFetch(`${studentUrl}/`)
            const data = await resp.json()

            const result = data.map((datum: ClassUserType) => {
                const value = `${datum.id} | ${datum.firstName} ${datum.lastName}`

                return ({
                    value: value,
                    label: value
                })
            })

            setStudentData({
                data: data,
                display: result
            })
            console.log(data)

        }

        fetchData()
        fetchStudents()
    }, [snap.opened])



    return (
        <ModifyDialog open={snap.opened} handleOnOpenChanged={handleOpen}
            title={title} handleSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Student
                    </Label>
                    <Combobox value={snap.data.studentId} onValueChange={(value) => {
                        store.data.studentId = courses?.display.find(item => item.label == value)?.value ?? ""
                    }}
                        data={courses.display}
                        className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Course
                    </Label>
                    <Combobox value={snap.data.courseId} onValueChange={(value) => {
                        store.data.courseId = courses?.display.find(item => item.label == value)?.value ?? ""
                    }}
                        data={courses.display}
                        className="col-span-3" />
                </div>
            </div>
        </ModifyDialog>
    )
}
