export interface MenuInfo {
    key: string
    keyPath: string[]
}

export interface WorkerMessagePort<A, B>
    extends Omit<MessagePort, 'postmessage' | 'onmessage'> {
    postMessage(message: A): void

    onmessage: ((ev: MessageEvent<B>) => void) | null
}

export interface WorkerMessageChannel<L, R> extends MessageChannel {
    port1: WorkerMessagePort<L, R>
    port2: WorkerMessagePort<R, L>
}
