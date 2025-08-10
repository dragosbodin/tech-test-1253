/// <reference lib ="WebWorker" />
/// <reference lib ="ESNext" />

import type { SpreadsheetRecord } from 'types/SpreadsheetRecord'

const activePorts: MessagePort[] = [] // All ports/tabs
const stateCache: Record<string, SpreadsheetRecord[]> = {} // Up-to-date state

const postMessageAll = (
    message: MessageEvent['data'],
    excludedPort: MessagePort | null = null
) => {
    activePorts.forEach((port) => {
        if (port !== excludedPort) {
            port.postMessage(message)
        }
    })
}

// @ts-expect-error missing SharedWorkerGlobalScope
self.onconnect = (ev: MessageEvent) => {
    const port = ev.ports[0]
    port.start()
    activePorts.push(port)

    port.onmessage = (ev: MessageEvent) => {
        const { type } = ev.data

        switch (type) {
            case 'set-state': {
                const { id, state } = ev.data

                if (!state) return

                stateCache[id] = state
                postMessageAll(
                    {
                        type: 'set-state',
                        id,
                        state,
                    },
                    port
                )

                return
            }
            case 'get-state': {
                const { id } = ev.data
                port.postMessage({
                    type: 'set-state',
                    id,
                    state: stateCache[id],
                })

                return
            }
            case 'close': {
                port.close()
                activePorts.splice(activePorts.indexOf(port), 1)

                return
            }
        }
    }
}
