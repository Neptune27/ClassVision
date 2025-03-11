import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const useHub = async (url: string) => {
    const connect = new HubConnectionBuilder()
        .withUrl(url)
        .configureLogging(LogLevel.Information)
        .build();

    await connect.start()

    return connect
}

export { useHub }