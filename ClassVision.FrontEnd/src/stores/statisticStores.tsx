import { proxy } from "valtio";

export const recognizeChartStore = proxy<{
    fetchTrigger: boolean, data: {
        time: string,
        automatic: number,
        manual: number,
        firstTime: number
    }[]
}>({
    fetchTrigger: false,
    data: [
        { time: "Jan", automatic: 400, manual: 300, firstTime: 200 },
        { time: "Feb", automatic: 500, manual: 400, firstTime: 250 },
        { time: "Mar", automatic: 600, manual: 350, firstTime: 300 },
        { time: "Apr", automatic: 550, manual: 450, firstTime: 320 },
        { time: "May", automatic: 700, manual: 500, firstTime: 380 },
    ]
})

export const activeUsersChartStore = proxy<{
    fetchTrigger: boolean, data: {
        date: string,
        users: number,
    }[]
}>({
    fetchTrigger: false,
    data: [
        { date: "2023-05-01", users: 1200 },
        { date: "2023-05-02", users: 1350 },
        { date: "2023-05-03", users: 1500 },
        { date: "2023-05-04", users: 1450 },
        { date: "2023-05-05", users: 1600 },
        { date: "2023-05-06", users: 1750 },
        { date: "2023-05-07", users: 1900 },
        { date: "2023-05-08", users: 2050 },
        { date: "2023-05-09", users: 2200 },
        { date: "2023-05-10", users: 2100 },
        { date: "2023-05-11", users: 2300 },
        { date: "2023-05-12", users: 2450 },
        { date: "2023-05-13", users: 2600 },
        { date: "2023-05-14", users: 2750 },
    ]
})