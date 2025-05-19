"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { activeUsersChartStore } from "../../stores/statisticStores"
import { useSnapshot } from "valtio"

// Sample data - replace with your actual data


export default function DailyUserChart() {
    const store = activeUsersChartStore;
    const snap = useSnapshot(store)



    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Daily Active Users</CardTitle>
                        <CardDescription>Breakdown by time</CardDescription>
                    </div>
                    {/*<Button variant="outline" onClick={() => setIsStacked(!isStacked)} className="ml-auto">*/}
                    {/*    {isStacked ? "Show Grouped" : "Show Stacked"}*/}
                    {/*</Button>*/}
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={{
                        users: {
                            label: "Daily Login",
                            color: "hsl(var(--chart-1))"
                        }
                    }}
                    className="h-[400px] w-full"
                >
                    <LineChart
                        data={snap.data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="users"
                            stroke="var(--color-users)"
                            strokeWidth={2}
                            dot={{
                                r: 4,
                                fill: "var(--color-users)",
                                strokeWidth: 0,
                            }}
                            activeDot={{
                                r: 6,
                                fill: "var(--color-users)",
                                stroke: "hsl(var(--background))",
                                strokeWidth: 2,
                            }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
