import { proxy } from 'valtio'
import { UserModifyType, UserType } from '../interfaces/UserTypes'

export const userDefault = (): UserModifyType => {
    return ({
        userName: "",
        password: "",
        email: ""
    })
}

export const userStore = proxy<{ fetchTrigger: number, data: UserType[] }>({
    fetchTrigger: 0,
    data: []
})

export const userModifyStore = proxy<{ opened: boolean, isEdit: boolean, data: UserModifyType }>({
    opened: false,
    isEdit: false,
    data: userDefault()
})

export const userDeleteStore = proxy<{ opened: boolean, id: string }>({
    id: "",
    opened: false
})


export const userBatchDeleteStore = proxy<{ opened: boolean, ids: string[] }>({
    ids: [],
    opened: false
})
