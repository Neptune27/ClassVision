export type CommonType = {
    createdAt: string,
    lastUpdated: string,
    isActive: boolean
}

export type ExcludeCommonType = "lastUpdated" | "isActive" | "createdAt";