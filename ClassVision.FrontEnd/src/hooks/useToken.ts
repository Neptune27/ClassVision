const useToken = () => {
    let bearer = localStorage.getItem("token")

    let sessionBearer = sessionStorage.getItem("token")
    if (sessionBearer !== null) {
        bearer = sessionBearer
    }

    return bearer
}

export default useToken