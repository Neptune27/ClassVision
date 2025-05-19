"use client"

import { useEffect } from "react"

const Logout = () => {
    useEffect(() => {
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")

        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        localStorage.removeItem("roles");
        window.location.replace("/login")
    }, [])

    return (<></>)
}

export default Logout