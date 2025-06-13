import { proxy } from 'valtio'
import { RoleType } from '../interfaces/RoleType'

export const roleDefault = (): RoleType => {
    return ({
        userName: "",
        roles: [],
        id: ""
    })
}

export const roleStore = proxy<{ fetchTrigger: number, data: RoleType[] }>({
    fetchTrigger: 0,
    data: []
})

export const roleModifyStore = proxy<{ opened: boolean, isEdit: boolean, data: RoleType, allRole: string[] }>({
    opened: false,
    isEdit: false,
    data: roleDefault(),
    allRole: []
})
