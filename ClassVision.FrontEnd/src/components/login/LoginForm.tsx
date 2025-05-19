"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent } from "react"
import { useFormStatus } from "react-dom"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const { pending } = useFormStatus();


    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // @ts-ignore
        const usernameElement = e.target[0] as HTMLInputElement
        // @ts-ignore
        const passwordElement = e.target[1] as HTMLInputElement

        const username = usernameElement.value
        const password = passwordElement.value

        console.log(e)
        console.log(usernameElement.value)
        console.log(passwordElement.value)

        const resp = await fetch(`/api/Account/Login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        if (!resp.ok) {
            const error = await resp.text();
            console.log(error);
            alert(error);
            return;
        }

        const result = await resp.json();
        const data = result["data"];
        console.log(data);



        localStorage.setItem("userId", data["userId"]);
        localStorage.setItem("email", data["email"]);
        localStorage.setItem("username", data["username"]);

        localStorage.setItem("token", data["token"]);
        localStorage.setItem("roles", JSON.stringify(result["roles"]) ?? "[]");

        const params = new URLSearchParams(window.location.search);
        const returnUrl = params.get('returnUrl');
        if (returnUrl) {
            location.href = returnUrl
        }
        else {
            location.href = "/dashboard"
        }
        //}
        //else {
        //sessionStorage.setItem("token", resultJson["token"])
        //}
    }

    return (
        <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6" >
                <div className="flex flex-col items-center text-center" >
                    <h1 className="text-2xl font-bold" > Welcome back </h1>
                    < p className="text-balance text-muted-foreground" >
                        Login to your Class Vision account
                    </p>
                </div>
                < div className="grid gap-2" >
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        required
                    />
                </div>
                < div className="grid gap-2" >
                    <div className="flex items-center" >
                        <Label htmlFor="password" > Password </Label>
                    </div>
                    < Input id="password" type="password" required />
                </div>
                < Button type="submit" className="w-full" >
                    Login
                </Button>
                < div className="text-center text-sm" >
                    Don&apos;t have an account? {" "}
                    <a href="/signup" className="underline underline-offset-4" >
                        Sign up
                    </a>
                </div>
            </div>
        </form>
    )
}