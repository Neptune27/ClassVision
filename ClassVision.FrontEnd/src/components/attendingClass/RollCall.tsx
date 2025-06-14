"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ScheduleType } from "../../interfaces/ScheduleTypes"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { RecognitionCard } from "./RecognitionCard"
import { rollCallCreateStore, rollCallHubStore, rollCallQRStore, rollCallStore } from "../../stores/rollcallStores"
import { EFaceStatus } from "../../interfaces/ImageFaceType"
import { Separator } from "../ui/separator"
import { RollCallStudentTable } from "./RollCallStudentTable"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { useProxy } from 'valtio/utils';
import { useHub } from "../../hooks/useHub"
import { EAttendantStatus } from "../../interfaces/AttendeeTypes"
import { imageDataConvert } from "../../lib/imageDataConvertion"
import { triggerFetch } from "../../lib/utils"
import { CreateRollCallDialog } from "./AttendingClassDialogs"
import { useSnapshot } from "valtio"
import Link from "next/link"
import { QrCode, QrCodeEcc } from "../../lib/qrcodegen"
import { toSvgString } from "../../lib/qrUltis"

const scheduleUrl = "/api/Schedule"
const attendeeUrl = "/api/Attendee"

const store = rollCallStore;
const hubStore = rollCallHubStore;
const createStore = rollCallCreateStore;

export function RollCall({ id, isClient, classId }: {
    id: string,
    isClient?: boolean,
    classId?: string
}) {
    const router = useRouter()

    if (isClient == undefined) {
        isClient = false
    }

    const [schedule, setSchedule] = useState<ScheduleType>()
    const snap = useSnapshot(store)
    const qrStore = rollCallQRStore;

    const fetchSchedule = async () => {
        const resp = await authorizedFetch(`${scheduleUrl}/${id}`);
        const data = await resp.json()
        console.log(data)

        setSchedule(data)
    }


    const handleMessageReceived = (resp: {
        path: string,
        imageFaces: {
            [id: string]: {
                id: string,
                user_id: string,
                status: EFaceStatus
            }
        }
    }) => {
        const data = store.data.find(it => it.path == resp.path)

        if (!data) {
            console.log("WTF")
            return
        }

        for (const key in resp.imageFaces) {
            const current = resp.imageFaces[key]

            const item = data.faces.find(f => f.id == key)

            if (!item) {
                continue
            }
            item.status = current.status
            item.user_id = current.user_id

            let status = EAttendantStatus.ABSENT
            switch (current.status) {
                case EFaceStatus.SELECTED:
                    status = EAttendantStatus.PRESENT
                    break
                default:
                    status = EAttendantStatus.ABSENT
                    break
                    
            }

            const att = store.attentee.find(a => a.studentId == current.user_id)
            if (att) {
                att.status = status
            }
        }

    }

    useEffect(() => {
        fetchSchedule()
        const joinSocket = async () => {
            await hubStore.startConnection()
            hubStore.hub?.on("ReceiveMessage", handleMessageReceived)
            await hubStore.hub?.invoke("JoinPath", id)
        }

        joinSocket()
        return () => {
            if (!hubStore.hub) {
                return
            }

            hubStore.hub.off("ReceiveMessage")
        }
    }, [])

    useEffect(() => {
        fetchSchedule()
    }, [snap.fetchTrigger])

    useEffect(() => {
        const students = schedule?.course?.enrollments.map(e => e.student)
            .filter(s => s != undefined)
        if (!students) {
            return
        }

        store.userData = students
        store.attentee = schedule?.attendants ?? []

        store.data = []
        //@ts-ignore
        store.data = schedule?.images?.map(imageDataConvert) 

        //store.data.splice(0, store.data.length)

        //store.data.push({
        //    path: "/api/Media/lop6.jpg",
        //    faces: ImageFaceExampleData
        //})

        if (store.attentee.length == 0) {
            handleCreateDialog(true)
        }

        console.log(store)
    }, [schedule])

    const handleCreateRollCall = async () => {
        const resp = await authorizedFetch(`/api/Attendee/bySchedule/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=UTF-8'
            },
        })

        triggerFetch(store)
    }

    const handleCreateClassInfoQR = () => {
        if (classId == undefined) {
            return
        }

        const qr0 = QrCode.encodeText(`https://${location.host}/dashboard/info/class/${classId}`, QrCodeEcc.MEDIUM);
        const svg = toSvgString(qr0, 4, "#FFFFFF", "#000000");

        qrStore.data = svg
        qrStore.opened = true
    }

    const handleCreateDialog = (isFirst: boolean) => {
        createStore.opened = true
        createStore.message = isFirst ? "This schedule have not been instancized, press Continue to create a new instance"
                                      : ""
    }

    return (
        <div className={"md:p-10 h-full"}>
            <CreateRollCallDialog handleSubmit={handleCreateRollCall} />

            <div className="flex justify-between gap-2 pb-2">
                {!isClient ?
                    <Link href={schedule?.course?.id ? `/dashboard/info/class/${schedule.course.id}` : "/dashboard"}>
                        <Button>
                            Back
                        </Button>
                    </Link>
                    : <div></div>
                }
                <h1 className="text-xl text-bold">Rollcall</h1>
                <div></div>
            </div>

            <div className="container mx-auto ">
                <RecognitionCard scheduleId={id} isClient={isClient} />
            </div>

            {isClient === false && <>
                <Separator className="mt-4 mb-4" />

                <RollCallStudentTable >
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="default" className="ml-2">
                                Actions
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={()=>handleCreateDialog(false)}>Create rollcall</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCreateClassInfoQR}>Show class</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </RollCallStudentTable>
                </>
            }
        </div>
    )
}
