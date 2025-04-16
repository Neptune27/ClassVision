"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Loader2, CheckCircle2, Calendar, Users, Clock, BookOpen } from "lucide-react"
import { CourseType } from "../../../interfaces/CourseTypes"
import { authorizedFetch } from "../../../utils/authorizedFetcher"

interface User {
    id: string
    name: string
    email: string
    enrolledCourses: string[]
}

export function AddAuthorizedStudentPage({ classId }: { classId: string  }) {
    const router = useRouter();

    const [courseData, setCourseData] = useState<CourseType | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isJoining, setIsJoining] = useState(false)
    const [hasJoined, setHasJoined] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch course data and user data
    useEffect(() => {
        async function fetchData() {
            try {
                setIsLoading(true)

                // Fetch joining status
                const hasJoinResponse = await authorizedFetch(`/api/Enrollment/IsEnroll/${classId}`)
                if (!hasJoinResponse.ok) {
                    throw new Error(`Failed to fetch joining status: ${hasJoinResponse.status}`)
                }
                const hasJoinData = await hasJoinResponse.json()

                console.log(hasJoinData)
                setHasJoined(hasJoinData)


                // Fetch course data
                const courseResponse = await fetch(`/api/Course/${classId}`)
                if (!courseResponse.ok) {
                    throw new Error(`Failed to fetch course data: ${courseResponse.status}`)
                }
                const courseData = await courseResponse.json()

                console.log(courseData)
                setCourseData(courseData)



            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred")
                console.error("Error fetching data:", err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [classId, router])

    const handleJoinClass = async () => {
        try {
            setIsJoining(true)

            // Simulate API call to join class
            const resp = await authorizedFetch("/api/Enrollment/ByUser", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    classId: classId
                })
            })
            if (!resp.ok) {
                setError(`Failed to fetch course data: ${resp.status}`)
                return
            }


            // Update local state to reflect successful join
            setHasJoined(true)

            // In a real app, you would update the user's enrolled courses on the server
        } catch (err) {
            setError("Failed to join class. Please try again.")
            console.error("Error joining class:", err)
        } finally {
            setIsJoining(false)
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
                <Card className="w-full max-w-md flex items-center justify-center p-8">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                        <p>Loading class information...</p>
                    </div>
                </Card>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
                <Card className="w-full max-w-md p-8">
                    <CardHeader>
                        <CardTitle className="text-xl text-red-500">Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Failed to load class information: {error}</p>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (hasJoined) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex flex-col items-center text-center">
                            <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                            <CardTitle className="text-xl">Successfully Joined</CardTitle>
                            <CardDescription>You have successfully joined {courseData?.courseName}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                    <h3>You have succesfully joined {courseData?.courseName}</h3>

                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" onClick={() => router.push(`/dashboard/info/class/${classId}`)}>
                            Go to Class
                        </Button>
                        <Button variant="outline" className="w-full" onClick={() => router.push("/dashboard")}>
                            Back to Dashboard
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl">{courseData?.courseName}</CardTitle>
                    <CardDescription>Class details for authenticated users</CardDescription>
                </CardHeader>
                <CardContent>
                    <h3>Do you want to join {courseData?.courseName}</h3>
                </CardContent>
                <CardFooter className="flex gap-4">
                    <Button variant="outline" className="flex-1" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button className="flex-1" onClick={handleJoinClass} disabled={isJoining}>
                        {isJoining ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Joining...
                            </>
                        ) : (
                            "Join Class"
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
