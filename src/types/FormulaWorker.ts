import type { WorkerMessageChannel } from 'types/App'

export const FORMULA_OPEN_MESSAGE_TYPE = 'open'
export const FORMULA_PARSE_MESSAGE_TYPE = 'parse'
export const FORMULA_CALCULATE_MESSAGE_TYPE = 'calculate'
export const FORMULA_PARSE_COMPLETE_MESSAGE_TYPE = 'parse-complete'
export const FORMULA_CALCULATE_COMPLETE_MESSAGE_TYPE = 'calculate-complete'
export const FORMULA_CLOSE_MESSAGE_TYPE = 'close'

export type FormulaOpenMessageType = typeof FORMULA_OPEN_MESSAGE_TYPE
export type FormulaParseMessageType = typeof FORMULA_PARSE_MESSAGE_TYPE
export type FormulaCalculateMessageType = typeof FORMULA_CALCULATE_MESSAGE_TYPE
export type FormulaParseCompleteMessageType = typeof FORMULA_PARSE_COMPLETE_MESSAGE_TYPE
export type FormulaCalculateCompleteMessageType =
    typeof FORMULA_CALCULATE_COMPLETE_MESSAGE_TYPE
export type FormulaCloseMessageType = typeof FORMULA_CLOSE_MESSAGE_TYPE

export type FormulaMessageType =
    | FormulaOpenMessageType
    | FormulaParseMessageType
    | FormulaCalculateMessageType
    | FormulaParseCompleteMessageType
    | FormulaCalculateCompleteMessageType
    | FormulaCloseMessageType

export interface FormulaMessage<T extends FormulaMessageType> {
    type: T
}

export interface OpenFormulaMessage extends FormulaMessage<FormulaOpenMessageType> {
    port: FormulaWorkerMessageChannel['port2']
}

export type FormulaCloseMessage = FormulaMessage<FormulaCloseMessageType>

export interface FormulaParseMessage extends FormulaMessage<FormulaParseMessageType> {
    formula: string
    cellRef: string
}

export interface FormulaCalculateMessage
    extends FormulaMessage<FormulaCalculateMessageType> {
    mathExp: string
    cellRef: string
}

export interface FormulaParseCompleteMessage
    extends FormulaMessage<FormulaParseCompleteMessageType> {
    isValid: boolean
    parsedFormula: string | null
    cellRef: string
}

export interface FormulaCalculateCompleteMessage
    extends FormulaMessage<FormulaCalculateCompleteMessageType> {
    result: number | null
    cellRef: string
}

export type FormulaWorkerReceivableMessages =
    | FormulaParseMessage
    | FormulaCalculateMessage
    | FormulaCloseMessage

export type FormulaWorkerSendableMessages =
    | FormulaParseCompleteMessage
    | FormulaCalculateCompleteMessage

export interface FormulaWorker extends Omit<Worker, 'postMessage'> {
    postMessage(
        message: OpenFormulaMessage,
        transfer: [FormulaWorkerMessageChannel['port2']]
    ): void
}

export type FormulaWorkerMessageChannel = WorkerMessageChannel<
    FormulaWorkerReceivableMessages,
    FormulaWorkerSendableMessages
>
