"use client"

import { useEffect, useState } from "react"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { NumberCard } from "./NumberCard"
import { getRandomInt } from "../../lib/utils"


const statisticUrl = `/api/statistic`

const duration = 300
const randomDuration = 700


export function StatisticCard() {
    const [data, setData] = useState({
        "totalClasses": 0,
        "totalStudents": 0,
        "totalTeachers": 0,
        "totalClassroom": 0,
        "totalAttendee": 0,
        "totalCourseType": 0,
        "totalEnrollment": 0,
        "totalSchedule": 0,
        "totalUser": 0,
        "currentlyAvailable": 0
    })

    useEffect(() => {
        const fetchData = async () => {
            const resp = await authorizedFetch(statisticUrl)
            if (!resp.ok) {
                console.error(await resp.text())
            }

            const data = await resp.json();
            console.log(data)
            setData(data)
        }
        fetchData()
        
    }, [])

    return (
        <div className="container mx-auto p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <NumberCard label={"Currently Available"} value={data.currentlyAvailable} duration={duration + getRandomInt(randomDuration)} />
                <NumberCard label={"Total Classes"} value={data.totalClasses} duration={duration + getRandomInt(randomDuration)} />
                <NumberCard label={"Total Students"} value={data.totalStudents} duration={duration + getRandomInt(randomDuration)} />
                <NumberCard label={"Total Teachers"} value={data.totalTeachers} duration={duration + getRandomInt(randomDuration)} />
                <NumberCard label={"Total Classroom"} value={data.totalClassroom} duration={duration + getRandomInt(randomDuration)} />
                <NumberCard label={"Total Course Type"} value={data.totalCourseType} duration={duration + getRandomInt(randomDuration)} />
                <NumberCard label={"Total Attendee"} value={data.totalAttendee} duration={duration + getRandomInt(randomDuration)} />
                <NumberCard label={"Total Enrollment"} value={data.totalEnrollment} duration={duration + getRandomInt(randomDuration)} />
                <NumberCard label={"Total Schedule"} value={data.totalSchedule} duration={duration + getRandomInt(randomDuration)} />
                <NumberCard label={"Total Users"} value={data.totalUser} duration={duration + getRandomInt(randomDuration)} />
            </div>

        </div>
    )
}