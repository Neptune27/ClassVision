"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface StatisticCardProps {
    label: string
    value: number
    duration?: number
}

export function NumberCard({ label, value, duration = 1000 }: StatisticCardProps) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number
        let animationFrameId: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = timestamp - startTime

            const percentage = Math.min(progress / duration, 1)
            const currentCount = Math.floor(percentage * value)

            setCount(currentCount)

            if (progress < duration) {
                animationFrameId = requestAnimationFrame(animate)
            } else {
                setCount(value)
            }
        }

        animationFrameId = requestAnimationFrame(animate)

        return () => {
            cancelAnimationFrame(animationFrameId)
        }
    }, [value, duration])

    return (
        <Card className="w-full max-w-md overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-700">{label}</h3>
                    <span className="text-4xl font-bold transition-all duration-300 ease-out">{count}</span>
                </div>
            </CardContent>
        </Card>
    )
}

