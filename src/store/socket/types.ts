export interface SocketState {
    remoteMode: boolean
    hostname: string
    port: number
    protocol: string
    reconnectInterval: number
    isConnected: boolean,
    isConnecting: boolean,
    needLogin: boolean,
    connectingFailed: boolean,
    username: null | string,
    token: null | string,
    refresh_token: null | string,
    loadings: string[]
}