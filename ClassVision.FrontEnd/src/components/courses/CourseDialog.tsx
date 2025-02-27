"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { useSnapshot } from "valtio"
import { useEffect, useState } from "react"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { DeleteDialog } from "../dialogs/DeleteDialog"
import { CourseModifyType } from "../../interfaces/CourseTypes"
import { courseDeleteStore, courseBatchDeleteStore, courseModifyStore } from "../../stores/courseStores"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { DatePicker, DateTimePicker24h, TimeOnly, TimePicker24h } from "../ui/date-picker"
import { format } from "date-fns"
import { Combobox, ComboboxData } from "../ui/combobox"
import { TeacherType } from "../../interfaces/TeacherTypes"
import { StudentType } from "../../interfaces/StudentTypes"
import { CourseInfoType } from "../../interfaces/CourseInfoType"
import { ClassroomType } from "../../interfaces/ClassroomType"
import { CourseStudentPopover } from "./CourseStudentPopover"
import { SimpleTimePicker } from "../ui/simple-time-picker"
import { DateTimePicker } from "../ui/datetime-picker"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { DateTime } from "luxon"
import { getDisplayId, toDisplayValue } from "../../lib/utils"
import { ScheduleModifyType, ScheduleType } from "../../interfaces/ScheduleTypes"
import { scheduleDefault } from "../../stores/scheduleStores"


const baseUrl = "/api/Course"
const teacherUrl = "/api/Teacher"
const classroomUrl = "/api/Classroom"
const courseInfoUrl = "/api/CourseInfo"
const studentUrl = "/api/Student"
const scheduleUrl = "/api/Schedule"
const enrollmentUrl = "/api/Enrollment"

export function CourseDeleteDialog() {
    const store = courseDeleteStore;
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
    }

    return (
        <DeleteDialog open={snap.opened} title={"Are you sure you want to delete this"}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}


export function CourseBatchDeleteDialog() {
    const store = courseBatchDeleteStore
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
    }

    return (
        <DeleteDialog open={snap.opened} title={`Are you sure you want to delete ${snap.ids.length} item(s)`}
            handleOnOpenChanged={handleOpen}
            handleSubmit={handleSubmit}

        />

    )
}



export function CourseDialog({ isEdit }: {
    isEdit: boolean
}) {
    const store = courseModifyStore

    const snap = useSnapshot(store)

    const [title, setTitle] = useState("")
    const [teacherData, setTeacherData] = useState<{
        data: TeacherType[],
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

    const [courseInfo, setCourseInfoData] = useState<{
        data: StudentType[],
        display: ComboboxData[]
    }>({
        data: [],
        display: []
    })


    const [rooms, setRoomsData] = useState<{
        data: ClassroomType[],
        display: ComboboxData[]
    }>({
        data: [],
        display: []
    })

    useEffect(() => {
        setTitle(snap.isEdit ? "Edit" : "Create")
    }, [snap.isEdit])


    useEffect(() => {
        if (!snap.opened) {
            return
        }

        const fetchTeachers = async () => {
            const resp = await authorizedFetch(`${teacherUrl}/`)
            const data = await resp.json()

            const result = data.map((datum: TeacherType) => {
                const value = `${datum.id} | ${datum.firstName} ${datum.lastName}`

                return ({
                    value: value,
                    label: value
                })
            })

            setTeacherData({
                data: data,
                display: result
            })
            console.log(data)

        }

        const fetchStudents = async () => {
            const resp = await authorizedFetch(`${studentUrl}/`)
            const data = await resp.json()

            const result = data.map((datum: StudentType) => {
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

        const fetchCourseInfos = async () => {
            const resp = await authorizedFetch(`${courseInfoUrl}/`)
            const data = await resp.json()

            const result = data.map((datum: CourseInfoType) => {
                const value = `${datum.id} | ${datum.name}`

                return ({
                    value: value,
                    label: value
                })
            })

            setCourseInfoData({
                data: data,
                display: result
            })
            console.log(data)

        }

        const fetchClassroom = async () => {
            const resp = await authorizedFetch(`${classroomUrl}/`)
            const data = await resp.json()

            const result = data.map((datum: ClassroomType) => {
                const value = `${datum.roomId}`

                return ({
                    value: value,
                    label: value
                })
            })

            setRoomsData({
                data: data,
                display: result
            })

            console.log(data)
        }

        fetchTeachers()
        fetchStudents()
        fetchCourseInfos()
        fetchClassroom()

    }, [snap.opened])

    useEffect(() => {
        store.data.classroomId = toDisplayValue(store.data.classroomId, rooms.display)
    }, [rooms])

    useEffect(() => {
        store.data.courseInfoId = toDisplayValue(store.data.courseInfoId, courseInfo.display)
    }, [courseInfo])

    useEffect(() => {
        store.data.teacherId = toDisplayValue(store.data.teacherId, teacherData.display)
    }, [teacherData])


    //useEffect(() => {
    //    store.data.teacherId = toDisplayValue(store.data.teacherId, teacherData.display)
    //}, [studentData])

    const handleOpen = (open: boolean) => {
        store.opened = open
    }

    const handleFinish = async (sentData: CourseModifyType) => {

    }

    const handleEdit = async (sentData: CourseModifyType) => {
        const url = `${baseUrl}/${snap.data.id}`
        console.log(url)
        const resp = await authorizedFetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sentData)
        })

        const data = await resp.json()
        console.log(data)
        store.opened = false
    }

    const handleSchedule = async (schedule: ScheduleModifyType, type: "POST" | "PUT") => {
        const url = `${scheduleUrl}/${schedule.id}`
        const resp = await authorizedFetch(url, {
            method: type,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(schedule)
        })
        console.log(await resp.text())
    }

    const handleStudent = async (studentId: string, courseId: string, type: "POST" | "PUT") => {
        let url = `${enrollmentUrl}`

        const resp = await authorizedFetch(url, {
            method: type,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                courseId: courseId,
                studentId: studentId
            })
        })
        console.log(await resp.text())
    }


    const handleCreate = async (sentData: CourseModifyType) => {
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
            console.log(await resp.text())
            return
        }

        const data = await resp.json() as CourseModifyType
        sentData.schedules = sentData.schedules.map(s => {
            return {
                ...s,
                courseId: data.id
            }
        })

        for (const schedule of sentData.schedules) {
            await handleSchedule(schedule, "POST")
        }

        for (const studentId of sentData.studentIds) {
            await handleStudent(studentId, data.id, "POST")
        }

        console.log(data)


        store.opened = false
    }


    const handleSubmit = () => {
        console.log(store)
        const data = JSON.parse(JSON.stringify(snap.data)) as CourseModifyType;
        data.schedules = data.schedules.map(s => {
            return {
                ...s,
                endTime: s.endTime.split(".")[0],
                startTime: s.startTime.split(".")[0],
            }
        })
        data.attendantId = data.attendantId.map(getDisplayId)
        data.classroomId = getDisplayId(data.classroomId)
        data.teacherId = getDisplayId(data.teacherId)
        data.courseInfoId = getDisplayId(data.courseInfoId)
        console.log(data)

        //data.userId = userData.find(u => u.userName == data.userId)?.id ?? ""


        //TODO: Handle this
        isEdit ? handleEdit(data) : handleCreate(data);
    }

    const handleDateChange = (date: Date | undefined, index: number) => {
        if (!date) {
            return
        }

        const dateString = DateTime.fromJSDate(date).toISODate();
        if (!dateString) {
            return
        }
        store.data.schedules[index].date = dateString
        console.log(store.data.schedules)
    }

    const handleTimeChange = (date: Date | undefined, index: number, type: "startTime" | "endTime") => {
        if (!date) {
            return
        }

        const dateString = DateTime.fromJSDate(date).toISOTime();
        if (!dateString) {
            return
        }
        store.data.schedules[index][type] = dateString
        console.log(store.data.schedules)
    }

    const handleScheduleDelete = (index: number) => {
        store.data.schedules.splice(index, 1)
    }

    const handlePeriodChange = (value: string, index: number) => {
        store.data.schedules[index].period = parseInt(value)
    }

    return (
        <ModifyDialog open={snap.opened} handleOnOpenChanged={handleOpen}
            className={"sm:max-w-[625px]"}
            title={title} handleSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id" className="text-right">
                        Id
                    </Label>
                    <Input id="id" value={snap.data.id} disabled onChange={(e) => {

                        store.data.id = e.target.value
                    }
                    } className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Teacher
                    </Label>
                    <Combobox value={snap.data.teacherId} onValueChange={(value) => {
                        store.data.teacherId = teacherData?.display.find(item => item.label == value)?.value ?? ""
                    }}
                        data={teacherData.display}
                        className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Course Info
                    </Label>
                    <Combobox value={snap.data.courseInfoId} onValueChange={(value) => {
                        store.data.courseInfoId = courseInfo?.display.find(item => item.label == value)?.value ?? ""
                    }}
                        data={courseInfo.display}
                        className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Schedule
                    </Label>
                    <div className="col-span-3 flex flex-col gap-4">
                        {snap.data.schedules.map((schedule, index) => {
                            return (
                                <Card key={index}>
                                    <CardContent className="p-4">
                                        <div className={"grid grid-cols-8 gap-2"}>
                                            <div className="col-span-4">
                                                <DateTimePicker value={new Date(schedule.date)} modal={true}
                                                    onChange={(date) => { handleDateChange(date, index) }} hideTime />
                                            </div>
                                            <Input className="col-span-2" type="number" value={schedule.period} onChange={(event) => handlePeriodChange(event.target.value, index)} />
                                            <Label className="flex justify-center items-center">Weeks</Label>
                                            <div className="col-span-3">
                                                <SimpleTimePicker modal={true} value={new Date(`2000-01-01T${schedule.startTime}`)}
                                                    onChange={(date) => handleTimeChange(date, index, "startTime")} />
                                            </div>
                                            <div className="col-span-3">
                                                <SimpleTimePicker modal={true} value={new Date(`2000-01-01T${schedule.endTime}`)}
                                                    onChange={(date) => handleTimeChange(date, index, "endTime")} />
                                            </div>
                                            <Button variant="destructive" className="col-span-2" onClick={()=>handleScheduleDelete(index)}>Delete</Button>
    
                                        </div>
                                    </CardContent>
                                </Card>

                            )
                        })}
                        <Button className="w-full" onClick={() => {
                            store.data.schedules.push({
                                ...scheduleDefault(),
                                courseId: store.data.id
                            })
                        }}>Add new schedule</Button>
                    </div>


                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="room" className="text-right">
                        Room
                    </Label>
                    <Combobox value={snap.data.classroomId} onValueChange={(value) => {
                        store.data.classroomId = rooms?.display.find(item => item.label == value)?.value ?? ""
                    }}
                        data={rooms.display}
                        className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="teacherId" className="text-right">
                        Students
                    </Label>
                    <CourseStudentPopover selectedData={snap.data.studentIds} setSelectedData={(value) => {
                        const selectedStudentId = studentData.display.find((item => item.label == value))?.label
                        if (!selectedStudentId) {
                            console.log("Student id not found?")
                            return
                        }
                        const displayId = getDisplayId(selectedStudentId)
                        const index = store.data.studentIds.indexOf(displayId)

                        if (index === -1) {
                            store.data.studentIds.push(displayId)
                        }
                        else {
                            store.data.studentIds.splice(index, 1)
                        }
                    }}
                        data={studentData}
                        className="col-span-3" />
                </div>
                {/*<div className="grid grid-cols-4 items-center gap-4">*/}
                {/*    <Label htmlFor="media" className="text-right">*/}
                {/*        Profile*/}
                {/*    </Label>*/}
                {/*    <Input id="media" value={snap.data.media} onChange={(e) => {*/}

                {/*        store.data.media = e.target.value*/}
                {/*    }}*/}
                {/*        className="col-span-3" />*/}
                {/*</div>*/}

            </div>
        </ModifyDialog>
    )
}
