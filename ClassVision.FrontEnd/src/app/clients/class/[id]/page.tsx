"use client"
import { useParams } from 'next/navigation'
import AddStudentPage from '@/components/infos/class/AddStudentPage'

export default function Page() {

    const params = useParams<{ id: string }>()

    const userId = localStorage.getItem("userId")

    if (userId !== null) {
        location.href = `/dashboard/join/${params.id}`
    }

    return (
        <AddStudentPage classId={params.id} />
    )


}