"use client"

import Link from "next/link"
import { Card, CardContent } from "../ui/card"
import { DateTimePicker } from "../ui/datetime-picker"
import { SimpleTimePicker } from "../ui/simple-time-picker"


export function TestFlex() {
    const make = [...Array(10).keys()]
    return (
        <div className="flex flex-wrap gap-4">
            {make.map((v, i) => {
                return (
                    <Card key={i}>
                        <CardContent className="p-4">

                        </CardContent>
                    </Card>

                )
            })}
        </div>

    )
}