"use client"

import { useEffect, useState } from "react"
import { Check, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "../../hooks/use-toast"
import { Combobox, ComboboxData } from "../ui/combobox"
import { roleModifyStore, roleStore } from "../../stores/roleStores"
import { useSnapshot } from "valtio"
import { ModifyDialog } from "../dialogs/ModifyDialog"
import { authorizedFetch } from "../../utils/authorizedFetcher"
import { triggerFetch } from "../../lib/utils"
//import { toast } from "@/components/hooks/use-toast"

// Available roles for selection
const dataStore = roleStore

export default function RoleSelectorDialog() {

    const store = roleModifyStore;
    const snap = useSnapshot(store)

    const [availableRoles, setAvailableRoles] = useState<ComboboxData[]>([])
    const [availableOptions, setAvailableOptions] = useState<ComboboxData[]>([])

    //const [selectedRoles, setSelectedRoles] = useState<{ label: string; value: string }[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Filter out already selected roles

    useEffect(() => {
        const newRoles = availableRoles.filter(
            (role) => !store.data.roles.some((selectedRole) => selectedRole === role.value))
        setAvailableOptions(newRoles)
    }, [availableRoles, snap.data.roles])


    const handleAddRole = (value: string) => {
        const roles = store.data.roles
        if (roles && !roles.some((selectedRole) => selectedRole === value)) {
            roles.push(value)
        }
    }

    const handleRemoveRole = (value: string) => {
        const newRoles = store.data.roles.filter(role => role !== value)
        store.data.roles = newRoles
    }

    const handleSubmit = async () => {
        if (store.data.roles.length === 0) {
            toast({
                title: "No roles selected",
                description: "Please select at least one role to submit.",
                variant: "destructive",
            })
            return
        }

        setIsSubmitting(true)

        try {
            console.log("Submitting roles:", snap.data.roles)
            const resp = await authorizedFetch('/api/Account/Roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: store.data.id,
                    roles: store.data.roles
                })
            })

            if (!resp.ok) {
                throw new Error(await resp.text())
            }

            toast({
                title: "Roles submitted successfully",
                description: `Submitted ${store.data.roles.length} role(s).`,
            })
            store.opened = false
            triggerFetch(dataStore)
            


        } catch (error) {
            toast({
                title: "Error submitting roles",
                description: "There was an error submitting the roles. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    useEffect(() => {
        if (!snap.opened) {
            return
        }
        const fetchData = async () => {
            const resp = await authorizedFetch("/api/Account/AllRoles");
            if (!resp.ok) {
                toast({
                    title: "Cannot get roles",
                    variant: "destructive",
                })
            }

            const data = await resp.json() as {
                name: string
            }[]
            setAvailableRoles(data.map(d => {
                return ({
                    label: d.name,
                    value: d.name
                })
            }))

            console.log(data)

            
        }

        fetchData()

    }, [snap.opened])


    const handleOpen = (open: boolean) => {
        store.opened = open
    }

    return (
        <ModifyDialog
            open={snap.opened} title={"Role Assignment"}
            handleOnOpenChanged={handleOpen} handleSubmit={handleSubmit}>
            <Combobox
                data={availableOptions}
                onValueChange={handleAddRole}
                value={""}
                className={"w-full"}
                placeholder={"Select role to add"}
                modal
            />

            <div className="mt-4">
                {snap.data.roles.length > 0 ? (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium">Selected Roles:</h3>
                        <div className="flex flex-wrap gap-2">
                            {snap.data.roles.map((role) => (
                                <Badge key={role} className="flex items-center gap-1 px-3 py-1">
                                    {role}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                                        onClick={() => handleRemoveRole(role)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        <span className="sr-only">Remove {role} role</span>
                                    </Button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">No roles selected. Use the dropdown above to add roles.</p>
                )}
            </div>
        </ModifyDialog>
    )
}
