import type { SyncWorker } from 'types/SyncWorker'

import TabSynchroniser from './syncWorker?sharedworker&inline'

export const syncSharedWorker: SyncWorker = new TabSynchroniser()
