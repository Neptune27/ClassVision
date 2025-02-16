import useToken from "../hooks/useToken"

const authorizedFetch = async (input: string | URL | globalThis.Request,
    init?: RequestInit, redirectOnUnathorized = () => { window.location.href = "/login" }): Promise<Response> => {

    if (init === undefined) {
        init = {
            "method": "GET",
            "headers": {}
        }
    }


    if (init["headers"] === undefined) {
        init["headers"] = {}
    }

    const bearer = useToken()

    // @ts-ignore
    init["headers"]["Authorization"] = "Bearer " + bearer
    const result = await fetch(input, init)

    if (result.status == 401) {
        console.log("Unauthorized, redirecting")
        redirectOnUnathorized();
    }

    return result
}


export { authorizedFetch }