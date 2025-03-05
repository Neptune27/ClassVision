export type CommonType = {
    createdAt: string,
    lastUpdated: string,
    isActive: boolean
}

export type VisibleNameType<TData> = {
    [K in keyof TData]?: string
}

export type ExcludeCommonType = "lastUpdated" | "isActive" | "createdAt";