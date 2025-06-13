import { proxy } from 'valtio'
import { ClassUserModifyType, ClassUserType } from '../interfaces/ClassUserTypes'

export const classUserDefault = (): ClassUserModifyType => {
    return ({
        id: "",
        firstName: "",
        lastName: "",
        media: "",
    })
}
export const classUserStore = proxy<{ fetchTrigger: number, data: ClassUserType[] }>({
    fetchTrigger: 0,
    data: []
})

export const classUserModifyStore = proxy<{ opened: boolean, isEdit: boolean, data: ClassUserModifyType }>({
    opened: false,
    isEdit: false,
    data: classUserDefault()
})

export const classUserDeleteStore = proxy<{ opened: boolean, id: string }>({
    id: "",
    opened: false
})

export const classUserBatchCreateStore = proxy<{ opened: boolean, qr: string, manualUsers: ClassUserModifyType[] }>({
    opened: false,
    qr: "",
    manualUsers: []
})


export const classUserBatchDeleteStore = proxy<{ opened: boolean, ids: string[] }>({
    ids: [],
    opened: false
})
