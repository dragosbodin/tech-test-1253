import { useEffect, useRef } from 'react'

import { syncSharedWorker } from 'core/workers/syncWorker'
import type { SpreadsheetRecord } from 'types/SpreadsheetRecord'

export const useSyncWorker = (
    initialState: SpreadsheetRecord[],
    setState: (newState: SpreadsheetRecord[]) => void,
    localId: string
) => {
    const messagePort = useRef<MessageChannel['port1']>(null)

    const setTabState = (newState: SpreadsheetRecord[]) => {
        setState(newState)
        syncSharedWorker.port.postMessage({
            type: 'set-state',
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
            type: 'get-state',
            id: localId,
        })

        return () => {
            messagePort.current?.postMessage({ type: 'close' })
            messagePort.current?.close()
            messagePort.current = null
        }
    }, [localId])

    return setTabState
}
