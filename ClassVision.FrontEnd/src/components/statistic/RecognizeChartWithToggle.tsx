"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { recognizeChartStore } from "../../stores/statisticStores"
import { useSnapshot } from "valtio"

// Sample data - replace with your actual data


export default function RecognizeChartWithToggle() {
    const [isStacked, setIsStacked] = useState(true)
    const store = recognizeChartStore;
    const snap = useSnapshot(store)


    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Time Series Analysis</CardTitle>
                        <CardDescription>Breakdown by automatic, manual, and first time</CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setIsStacked(!isStacked)} className="ml-auto">
                        {isStacked ? "Show Grouped" : "Show Stacked"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        automatic: {
                            label: "Automatic",
                            color: "#2563eb",
                        },
                        manual: {
                            label: "Manual",
                            color: "#22c55e",
                        },
                        firstTime: {
                            label: "First Time",
                            color: "#ef4444",
                        },
                    }}
                    className="h-[400px] w-full"
                >
                    <BarChart
                        data={snap.data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="automatic"
                            fill="var(--color-automatic)"
                            stackId={isStacked ? "stack" : undefined}
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="manual"
                            fill="var(--color-manual)"
                            stackId={isStacked ? "stack" : undefined}
                            radius={[4, 4, 0, 0]}
                        />
                        <Bar
                            dataKey="firstTime"
                            fill="var(--color-firstTime)"
                            stackId={isStacked ? "stack" : undefined}
                            radius={[4, 4, 0, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
