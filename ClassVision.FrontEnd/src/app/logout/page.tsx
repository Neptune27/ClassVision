"use client"

import { useEffect } from "react"

const Logout = () => {
    useEffect(() => {
        localStorage.removeItem("token")
        sessionStorage.removeItem("token")
        window.location.replace("/login")
    }, [])

    return (<></>)
}

export default Logout