import { useSnapshot } from "valtio";
import { classUserBatchCreateStore } from "../../stores/classUserStores";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";

export function ManualClassUserAdd() {
    const store = classUserBatchCreateStore;
    const snap = useSnapshot(store)

    const addStudent = () => {
        store.manualUsers.push({ id: crypto.randomUUID(), firstName: "", lastName: "", media: "" })

    }

    const removeStudent = (id: string) => {
        store.manualUsers = store.manualUsers.filter((student) => student.id !== id)
    }

    const updateStudent = (id: string, field: "firstName" | "lastName", value: string) => {
        const student = store.manualUsers.find(u => u.id == id);

        if (student === undefined) {
            toast("Student not found?")
            return
        }
        student[field] = value
        //setStudents(students.map((student) => (student.id === id ? { ...student, [field]: value } : student)))
    }

    return (
        <div className="max-h-[40vh] overflow-y-auto py-4">
            {snap.manualUsers.map((student, index) => (
                <div key={student.id} className="mb-4 grid grid-cols-[1fr_1fr_auto] gap-4 items-end">
                    <div className="space-y-2">
                        <Label htmlFor={`firstName-${student.id}`}>First name</Label>
                        <Input
                            id={`firstName-${student.id}`}
                            value={student.firstName}
                            onChange={(e) => updateStudent(student.id, "firstName", e.target.value)}
                            placeholder="John"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`lastName-${student.id}`}>Last name</Label>
                        <Input
                            id={`lastName-${student.id}`}
                            value={student.lastName}
                            onChange={(e) => updateStudent(student.id, "lastName", e.target.value)}
                            placeholder="Doe"
                            required
                        />
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStudent(student.id)}
                        className="h-10 w-10 shrink-0"
                        aria-label="Remove student"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button type="button" variant="outline" className="w-full" onClick={addStudent}>
                Add Another Student
            </Button>

        </div>

    )

}