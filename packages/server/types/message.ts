export type ChildProcessMessage = {
    type: ChildProcessMessageType
}

export enum ChildProcessMessageType {
    MESSAGE = 'message',
    CONTROL = 'control',
    SOCKETCONNECT = 'socket-connection'
}

