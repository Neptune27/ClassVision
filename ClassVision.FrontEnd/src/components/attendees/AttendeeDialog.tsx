"use client"
import { Label } from "@/components/ui/label"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { useEffect, useState } from "react"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { DeleteDialog } from "../dialogs/DeleteDialog"
import { AttendeeModifyType, EAttendantStatus } from "../../interfaces/AttendeeTypes"
import { attendeeDeleteStore, attendeeBatchDeleteStore, attendeeModifyStore, attendeeStore } from "../../stores/attendeeStores"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Combobox, ComboboxData } from "../ui/combobox"
import { getDisplayId, triggerFetch } from "../../lib/utils"
import { CourseType } from "../../interfaces/CourseTypes"
import { StudentType } from "../../interfaces/StudentTypes"
import { ScheduleType } from "../../interfaces/ScheduleTypes"
import { EnrollmentType } from "../../interfaces/EnrollmentTypes"


const baseUrl = "/api/Attendee"
const courseUrl = "/api/Course"
const scheduleUrl = "/api/Schedule"
const enrollmentUrl = "/api/Enrollment"

export function AttendeeDeleteDialog() {
    const store = attendeeDeleteStore;
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
        triggerFetch(attendeeStore)

    }

    return (
        <DeleteDialog open={snap.opened} title={"Are you sure you want to delete this"}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}


export function AttendeeBatchDeleteDialog() {
    const store = attendeeBatchDeleteStore
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
        triggerFetch(attendeeStore)

    }

    return (
        <DeleteDialog open={snap.opened} title={`Are you sure you want to delete ${snap.ids.length} item(s)`}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}


export function AttendeeDialog({ isEdit }: {
    isEdit: boolean
}) {
    const store = attendeeModifyStore

    const snap = useSnapshot(store)

    const [title, setTitle] = useState("")
    const [courses, setCoursesData] = useState<{
        data: CourseType[],
        display: ComboboxData[]
    }>({
        data: [],
        display: []
    })

    const [studentData, setStudentData] = useState<{
        data: StudentType[],
        display: ComboboxData[]
    }>({
        data: [],
        display: []
    })

    const [schedule, setScheduleData] = useState<{
        data: ScheduleType[],
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

    const handleEdit = async (sentData: AttendeeModifyType) => {
        const url = `${baseUrl}/`
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

    const handleCreate = async (sentData: AttendeeModifyType) => {
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
        data.studentId = getDisplayId(data.studentId)
        data.scheduleId = getDisplayId(data.scheduleId)
        isEdit ? await handleEdit(data) : await handleCreate(data);
        triggerFetch(attendeeStore)

    }


    useEffect(() => {
        if (!snap.opened) {
            return
        }

        const fetchCourse = async () => {
            const resp = await authorizedFetch(`${courseUrl}/`)
            const data = await resp.json()

            const result: ComboboxData[] = data.map((datum: CourseType) => {
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

            store.data.courseId = result?.find(r => getDisplayId(r.value) == store.data.courseId)?.value ?? ""

        }

        fetchCourse()
    }, [snap.opened])

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!snap.data.courseId) {
                console.log("Course id is empty")
                return
            }

            const courseId = getDisplayId(snap.data.courseId)

            const resp = await authorizedFetch(`${scheduleUrl}?courseId=${courseId}`)
            const data = await resp.json()

            const result: ComboboxData[] = data.map((datum: ScheduleType) => {

                if (datum.course == undefined) {
                    return
                }

                const value = `${datum.id} | ${datum.course.courseInfo.name} ${datum.course.classroom.roomId}`

                return ({
                    value: value,
                    label: value
                })
            })

            setScheduleData({
                data: data,
                display: result
            })
            console.log(store.data.scheduleId)
            store.data.scheduleId = result?.find(r => getDisplayId(r.value) == store.data.scheduleId)?.value ?? store.data.scheduleId

        }

        fetchSchedule()
    }, [snap.data.courseId])

    useEffect(() => {
        const fetchStudents = async () => {
            if (!snap.data.courseId) {
                console.log("Course id is empty")
                return 
            }
            const courseId = getDisplayId(snap.data.courseId)
            const resp = await authorizedFetch(`${enrollmentUrl}?courseId=${courseId}`)
            const data = await resp.json()

            const result = data.map((datum: EnrollmentType) => {
                const value = `${datum.studentId}`

                return ({
                    value: value,
                    label: value
                })
            })

            setStudentData({
                data: data,
                display: result
            })

        }

        fetchStudents()
    }, [snap.data.courseId])



    return (
        <ModifyDialog open={snap.opened} handleOnOpenChanged={handleOpen}
            title={title} handleSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Course
                    </Label>
                    <Combobox disable={snap.isEdit} value={snap.data.courseId} onValueChange={(value) => {
                        store.data.courseId = courses?.display.find((item: { label: string }) => item.label == value)?.value ?? ""
                    }}
                        data={courses.display}
                        className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Student
                    </Label>
                    <Combobox disable={snap.isEdit} value={snap.data.studentId} onValueChange={(value) => {
                        store.data.studentId = studentData?.display.find((item: { label: string }) => item.label == value)?.value ?? ""
                    }}
                        data={studentData.display}
                        className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Schedule
                    </Label>
                    <Combobox disable={snap.isEdit} modal value={snap.data.scheduleId} onValueChange={(value) => {
                        store.data.scheduleId = schedule?.display.find((item: { label: string }) => item.label == value)?.value ?? ""
                    }}
                        data={schedule.display}
                        className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="status" className="text-right">
                        Status
                    </Label>
                    <Select value={snap.data.status.toString()} onValueChange={(value: string) => {
                        store.data.status = parseInt(value)
                    }} >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={EAttendantStatus.PRESENT.toString()}>Present</SelectItem>
                            <SelectItem value={EAttendantStatus.LATE.toString()}>Late</SelectItem>
                            <SelectItem value={EAttendantStatus.ABSENT.toString()}>Absent</SelectItem>
                            <SelectItem value={EAttendantStatus.EXCUSED.toString()}>Excused</SelectItem>
                            <SelectItem value={EAttendantStatus.OTHER.toString()}>Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </ModifyDialog>
    )
}
