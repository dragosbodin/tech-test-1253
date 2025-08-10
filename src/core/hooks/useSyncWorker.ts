import { useEffect, useRef } from 'react'

import { syncSharedWorker } from 'core/workers/syncWorker'
import type { SpreadsheetRecord } from 'types/SpreadsheetRecord'
import {
    SYNC_CLOSE_MESSAGE_TYPE,
    SYNC_GET_STATE_MESSAGE_TYPE,
    SYNC_SET_STATE_MESSAGE_TYPE,
    type SyncWorkerMessageChannel,
} from 'types/SyncWorker'

export const useSyncWorker = (
    initialState: SpreadsheetRecord[],
    setState: (newState: SpreadsheetRecord[]) => void,
    localId: string
) => {
    const messagePort = useRef<SyncWorkerMessageChannel['port1']>(null)

    const setTabState = (newState: SpreadsheetRecord[]) => {
        setState(newState)
        syncSharedWorker.port.postMessage({
            type: SYNC_SET_STATE_MESSAGE_TYPE,
            id: localId,
            state: newState,
        })
    }

    useEffect(() => {
        syncSharedWorker.port.onmessage = ({ data }) => {
            const { state, id } = data

            if (!state) {
                setTabState(initialState)

                return
            }

            if (id == localId) {
                setState(state)
            } else {
                setState(initialState)
            }

            return
        }
        syncSharedWorker.port.onmessageerror = (ev) => {
            console.error(ev)
        }
        syncSharedWorker.port.start()
        syncSharedWorker.port.postMessage({
            type: SYNC_GET_STATE_MESSAGE_TYPE,
            id: localId,
        })

        return () => {
            messagePort.current?.postMessage({ type: SYNC_CLOSE_MESSAGE_TYPE })
            messagePort.current?.close()
            messagePort.current = null
        }
    }, [localId])

    return setTabState
}
