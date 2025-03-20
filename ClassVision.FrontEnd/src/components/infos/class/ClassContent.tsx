"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../ui/card"
import { Button } from "../../ui/button"
import { useEffect, useState } from "react"
import { CourseType } from "../../../interfaces/CourseTypes"
import { useSnapshot } from "valtio"
import { courseStore } from "../../../stores/courseStores"
import { authorizedFetch } from "../../../utils/authorizedFetcher"
import Link from "next/link"

export function ClassContent() {

    const store = courseStore;
    const snap = useSnapshot(store)
    const data = snap.data

    const fetchData = async () => {
        const resp = await authorizedFetch("/api/Course")
        store.data = await resp.json()
    }

    useEffect(() => {
        fetchData()
    }, [snap.fetchTrigger])

    useEffect(() => {
        fetchData()
    }, [])
    return (
        <div className="p-4">
            <h1 className="text-bold text-xl pb-4">Current:</h1>
            <div className="flex flex-wrap gap-4 ">
                {data.map(s => <Card key={s.id} className="max-w-[350px]">
                    <CardHeader>
                        <CardTitle>{s.courseInfo.name}</CardTitle>
                        <CardDescription>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                    casss
                    </CardContent>
                    <CardFooter >
                        <Link className="w-full" href={`./class/${s.id}`}>
                            <Button className="w-full">Go</Button>
                        </Link>
                    </CardFooter>
                </Card>)}
            </div>
        </div>
    )
}
