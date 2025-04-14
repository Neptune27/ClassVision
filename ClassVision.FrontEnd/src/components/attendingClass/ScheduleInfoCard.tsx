import Link from "next/link"
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Card } from "../ui/card"
import { Button } from "@/components/ui/button"
import { ScheduleType } from "../../interfaces/ScheduleTypes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EllipsisIcon } from "lucide-react"

const handleDelete = (id: string) => {
    console.log(id)
}
export function ScheduleInfoCard({ schedule }: {
    schedule: ScheduleType
}) {

    

    return (
        <Card className="max-w-[350px]">
            <CardHeader>
                <CardTitle className="flex justify-between">
                        {schedule.course.courseName}
                    <DropdownMenu>
                        <DropdownMenuTrigger><EllipsisIcon /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(schedule.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </CardTitle>
                <CardDescription>
                    <h2 className="font-bold">{schedule.date}</h2>
                    <div>{schedule.startTime}-{schedule.endTime}</div>
                </CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
            <CardFooter >
                <Link className="w-full" href={`/dashboard/info/class/${schedule.course?.id}/${schedule.id}`}>
                    <Button className="w-full">Go</Button>
                </Link>
            </CardFooter>
        </Card >
    )
}