import { toast } from "sonner"
import useToken from "../hooks/useToken"

const authorizedFetch = async (input: string | URL | globalThis.Request,
    init?: RequestInit, redirectOnUnathorized = () => {
        const searchParams = new URLSearchParams({
            returnUrl: location.href
        })
        window.location.href = "/login?" + searchParams.toString()
    }, throwOnNotOk: boolean = true): Promise<Response> => {

    if (init === undefined) {
        init = {
            "method": "GET",
            "headers": {}
        }
    }


    if (init["headers"] === undefined) {
        init["headers"] = {}
    }

    const bearer = useToken() ?? ""

    // @ts-ignore
    init["headers"]["Authorization"] = "Bearer " + bearer
    const result = await fetch(input, init)

    if (result.status == 401) {
        console.log("Unauthorized, redirecting")
        redirectOnUnathorized();
    }


    if (throwOnNotOk && !result.ok) {
        toast("Something unexpected happend.")
    }

    return result
}


export { authorizedFetch }