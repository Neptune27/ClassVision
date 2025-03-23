import { proxy, ref } from 'valtio'
import { EnrollmentModifyType } from '../interfaces/EnrollmentTypes'
import { ImageBasicInfomation, ImageFaceType } from '../interfaces/ImageFaceType'
import { StudentType } from '../interfaces/StudentTypes'
import { AttendeeType } from '../interfaces/AttendeeTypes'
import { HubConnection } from '@microsoft/signalr'
import { useHub } from '../hooks/useHub'


export type RollcallStoreType = {
    userData: StudentType[],
    attentee: AttendeeType[],
    data: {
        path: string,
        faces: ImageFaceType[]
    }[],
    fetchTrigger: boolean,

}

export const rollCallStore = proxy<RollcallStoreType>({
    userData: [],
    attentee: [],
    data: [],
    fetchTrigger: false
})

export const rollCallQRStore = proxy<{ opened: boolean, data: string }>({
    data: "",
    opened: false
})


export const rollCallCreateStore = proxy<{ opened: boolean, message: string }>({
    message: "",
    opened: false
})

export const rollCallHubStore = proxy<{
    hub?: HubConnection,
    startConnection: () => Promise<void>,
    stopConnection: () => Promise<void>,
}>({
    async startConnection() {
        if (rollCallHubStore.hub) return; // Prevent duplicate connections

        try {
            const connection = await useHub("/api/rollcallhub");

            rollCallHubStore.hub = ref(connection); // Store the connection in Valtio
        } catch (error) {
            console.error("SignalR Connection Error:", error);
        }
    },

    async stopConnection() {
        if (rollCallHubStore.hub) {
            await rollCallHubStore.hub.stop();
            //rollCallHubStore.hub = null;
            console.log("SignalR Disconnected");
        }
    },
})
