export interface ServerAuthorizationState {
    apiKey: string
    availableUsers: ServerAuthorizationStateUser[]
}

export interface ServerAuthorizationStateUser {
    username: string,
    created: number
}