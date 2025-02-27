"use client"

export default function Page() {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1920 1080">
            <image width="1920" height="1080" xlinkHref="/api/Media/test.png"></image>
            <a onClick={() => {
                alert("A")
            }} className={"border-4 border-indigo-500"}>
                <rect x="820" y="284" fill="#fff" opacity="0"  width="341" height="336"></rect>
            </a>
        </svg>
    )
}