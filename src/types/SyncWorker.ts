import type { WorkerMessageChannel } from 'types/App'

export const SYNC_CONNECT_MESSAGE_TYPE = 'connect'
export const SYNC_SET_STATE_MESSAGE_TYPE = 'set-state'
export const SYNC_GET_STATE_MESSAGE_TYPE = 'get-state'
export const SYNC_CLOSE_MESSAGE_TYPE = 'close'

export type SyncConnectMessageType = typeof SYNC_CONNECT_MESSAGE_TYPE
export type SyncSetStateMessageType = typeof SYNC_SET_STATE_MESSAGE_TYPE
export type SyncGetStateMessageType = typeof SYNC_GET_STATE_MESSAGE_TYPE
export type SyncCloseMessageType = typeof SYNC_CLOSE_MESSAGE_TYPE

export type SyncMessageType =
    | SyncConnectMessageType
    | SyncSetStateMessageType
    | SyncGetStateMessageType
    | SyncCloseMessageType

export interface SyncMessage<T extends SyncMessageType> {
    type: T
}

export type SyncCloseMessage = SyncMessage<SyncCloseMessageType>

export interface SyncSetStateMessage extends SyncMessage<SyncSetStateMessageType> {
    id: string
    state: Record<string, number>[] | null
}

export interface SyncGetStateMessage extends SyncMessage<SyncGetStateMessageType> {
    id: string
}

export type SyncWorkerReceivableMessages =
    | SyncSetStateMessage
    | SyncGetStateMessage
    | SyncCloseMessage

export type SyncWorkerSendableMessages = SyncSetStateMessage

export interface SyncWorker extends Omit<SharedWorker, 'port'> {
    port: SyncWorkerMessageChannel['port1']
}

export type SyncWorkerMessageChannel = WorkerMessageChannel<
    SyncWorkerReceivableMessages,
    SyncWorkerSendableMessages
>
