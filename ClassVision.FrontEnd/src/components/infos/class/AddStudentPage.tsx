"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Loader2, UserCircle } from "lucide-react"
import { CourseType } from "../../../interfaces/CourseTypes"
import { authorizedFetch } from "../../../utils/authorizedFetcher"
import { ClassUserType } from "../../../interfaces/ClassUserTypes"

export default function AddStudentPage({ classId }: {
    classId: string
}) {
    const [courseData, setCourseData] = useState<CourseType | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isComplete, setIsComplete] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")


    const handleCreateStudent = async () => {
        const resp = await authorizedFetch(`/api/Student`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                id: "a"
            })
        })

        if (!resp.ok) {
            setError(await resp.text())
            console.error("Error fetching course data")
        }

        const student = await resp.json();
        return student as ClassUserType
    }

    const handleJoinClass = async (classId: string, studentId: string) => {
        const resp = await authorizedFetch(`/api/Enrollment`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId: studentId,
                courseId: classId
            })
        })

        if (!resp.ok) {
            setError(await resp.text())
            console.error("Error fetching course data")
        }

    }

    const handleAddStudent = async () => {

        const student = await handleCreateStudent();
        console.log(student)

        if (courseData?.id == null) {
            setError("Class id not found?")
            return
        }

        await handleJoinClass(courseData?.id, student.id)

        setIsComplete(true)
        
    }

    useEffect(() => {
        async function fetchCourseData() {
            try {
                setIsLoading(true)
                const response = await fetch(`/api/Course/${classId}`)

                if (!response.ok) {
                    throw new Error(`Failed to fetch course data: ${response.status}`)
                }

                const data = await response.json()
                setCourseData(data)
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred")
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourseData()
    }, [classId])

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


    if (isComplete) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex flex-col items-center text-center">
                            <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
                            <CardTitle className="text-xl">Student Added Successfully</CardTitle>
                            <CardDescription>
                                {firstName} {lastName} has been added to {courseData?.courseName}
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4 items-center">
                        <div className="bg-gray-50 p-4 rounded-md w-full">
                            <p className="font-medium">Student Details:</p>
                            <p>First Name: {firstName}</p>
                            <p>Last Name: {lastName}</p>
                            <p>Class: {courseData?.courseName}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-gray-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl">Add student for class {courseData?.courseName}</CardTitle>
                    <CardDescription>Enter the student's information below</CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName"
                                    value={firstName}
                                    onChange={(e) => {
                                        setFirstName(e.target.value)
                                    }}
                                    placeholder="Enter first name" />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" value={lastName}
                                    onChange={(e) => {
                                        setLastName(e.target.value)
                                    }}
                                    placeholder="Enter last name" />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full"
                        onClick={handleAddStudent}
                    >Add Student</Button>

                    <Separator className="my-2" />

                    <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                            onClick={() => {
                                location.href = `/login?returnUrl=${location.href}`
                            }}
                    >
                        <UserCircle className="h-4 w-4" />
                        Authorized User Login
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
