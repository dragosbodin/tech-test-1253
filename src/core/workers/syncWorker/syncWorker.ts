/// <reference lib ="WebWorker" />
/// <reference lib ="ESNext" />

import type { SpreadsheetRecord } from 'types/SpreadsheetRecord'
import {
    SYNC_CLOSE_MESSAGE_TYPE,
    SYNC_GET_STATE_MESSAGE_TYPE,
    SYNC_SET_STATE_MESSAGE_TYPE,
    type SyncConnectMessageType,
    type SyncWorkerMessageChannel,
    type SyncWorkerReceivableMessages,
    type SyncWorkerSendableMessages,
} from 'types/SyncWorker'

const activePorts: SyncWorkerMessageChannel['port2'][] = [] // All ports/tabs
const stateCache: Record<string, SpreadsheetRecord[]> = {} // Up-to-date state

const postMessageAll = (
    message: SyncWorkerSendableMessages,
    excludedPort: MessagePort | null = null
) => {
    activePorts.forEach((port) => {
        if (port !== excludedPort) {
            port.postMessage(message)
        }
    })
}

const validateConnectEvent = (
    ev: MessageEvent
): ev is MessageEvent<SyncConnectMessageType> => {
    if (ev.type !== 'connect') return false
    return ev.ports[0] instanceof MessagePort
}

// @ts-expect-error missing SharedWorkerGlobalScope
self.onconnect = (ev: MessageEvent) => {
    if (validateConnectEvent(ev)) {
        const port = ev.ports[0]
        port.start()
        activePorts.push(port)

        port.onmessage = (ev: MessageEvent<SyncWorkerReceivableMessages>) => {
            const { type } = ev.data

            switch (type) {
                case SYNC_SET_STATE_MESSAGE_TYPE: {
                    const { id, state } = ev.data

                    if (!state) return

                    stateCache[id] = state
                    postMessageAll(
                        {
                            type: SYNC_SET_STATE_MESSAGE_TYPE,
                            id,
                            state,
                        },
                        port
                    )

                    return
                }
                case SYNC_GET_STATE_MESSAGE_TYPE: {
                    const { id } = ev.data
                    port.postMessage({
                        type: SYNC_SET_STATE_MESSAGE_TYPE,
                        id,
                        state: stateCache[id],
                    })

                    return
                }
                case SYNC_CLOSE_MESSAGE_TYPE: {
                    port.close()
                    activePorts.splice(activePorts.indexOf(port), 1)

                    return
                }
                default: {
                    throw new Error(
                        `Invalid receivable message type ${type satisfies never}`
                    )
                }
            }
        }
    } else {
        throw new Error(`Invalid message with type ${ev.type} sent to sync worker`)
    }
}
