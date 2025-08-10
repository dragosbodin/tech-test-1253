import type { GridApi } from 'ag-grid-community'
import { useEffect, useRef } from 'react'

import { CELL_REFERENCE_RX } from 'constants/formula'
import { formulaWebWorker } from 'core/workers/formulaWorker'
import {
    FORMULA_CALCULATE_COMPLETE_MESSAGE_TYPE,
    FORMULA_CALCULATE_MESSAGE_TYPE,
    FORMULA_CLOSE_MESSAGE_TYPE,
    FORMULA_OPEN_MESSAGE_TYPE,
    FORMULA_PARSE_COMPLETE_MESSAGE_TYPE,
    FORMULA_PARSE_MESSAGE_TYPE,
    type FormulaWorkerMessageChannel,
} from 'types/FormulaWorker'
import type { SpreadsheetRecord } from 'types/SpreadsheetRecord'

export const useFormulaWorker = (
    gridApi: GridApi<SpreadsheetRecord> | null,
    enabled: boolean
) => {
    const messagePort = useRef<FormulaWorkerMessageChannel['port1']>(null)

    useEffect(() => {
        const { port1, port2 }: FormulaWorkerMessageChannel = new MessageChannel()
        messagePort.current = port1
        port1.onmessage = ({ data }) => {
            const { type } = data

            switch (type) {
                case FORMULA_PARSE_COMPLETE_MESSAGE_TYPE: {
                    const { isValid, parsedFormula, cellRef } = data

                    if (isValid && parsedFormula != null && gridApi != null) {
                        calculateFormula(parsedFormula, cellRef)
                    }

                    return
                }
                case FORMULA_CALCULATE_COMPLETE_MESSAGE_TYPE: {
                    const { result, cellRef } = data

                    if (result != null && gridApi != null) {
                        const [letter, ...rowIdx] = cellRef
                        const parsedRowIdx = parseInt(rowIdx.join('')) - 1

                        const rowNodeAtIdx = gridApi.getDisplayedRowAtIndex(parsedRowIdx)
                        if (!rowNodeAtIdx) {
                            throw new Error(`Invalid row reference ${cellRef}`)
                        }

                        rowNodeAtIdx.setDataValue(letter, result)
                        if (result < 0) {
                            gridApi.flashCells({
                                columns: [letter],
                                rowNodes: [rowNodeAtIdx],
                            })
                        }
                    }

                    return
                }
                default:
                    // This ensures all cases are handled
                    return type satisfies never
            }
        }
        port1.onmessageerror = (ev) => {
            console.error(ev)
        }

        formulaWebWorker.postMessage(
            {
                type: FORMULA_OPEN_MESSAGE_TYPE,
                port: port2,
            },
            [port2]
        )

        return () => {
            messagePort.current?.postMessage({ type: FORMULA_CLOSE_MESSAGE_TYPE })
            messagePort.current?.close()
            messagePort.current = null
        }
    }, [gridApi, enabled])

    const parseFormula = (formula: string, cellRef: string) => {
        if (messagePort.current == null) throw new Error('formulaWorker is not available')

        messagePort.current.postMessage({
            type: FORMULA_PARSE_MESSAGE_TYPE,
            formula,
            cellRef,
        })
    }

    const getCellValueByRef = (ref: string) => {
        if (!CELL_REFERENCE_RX.test(ref)) {
            throw new Error(`Invalid cell reference ${ref}`)
        }

        if (!gridApi) {
            throw new Error('Grid API is not available')
        }

        const [letter, ...rowIdx] = ref
        const parsedRowIdx = parseInt(rowIdx.join('')) - 1

        const rowNodeAtIdx = gridApi.getDisplayedRowAtIndex(parsedRowIdx)
        if (!rowNodeAtIdx) {
            throw new Error(`Invalid row reference ${ref}`)
        }

        return rowNodeAtIdx.data?.[letter]
    }

    const calculateFormula = (parsedFormula: string, cellRef: string) => {
        if (messagePort.current == null) throw new Error('formulaWorker is not available')

        const tokensWithCellValues = parsedFormula.split(/([+\-*/])/g).map((token) => {
            const cellReferenceMatch = token.match(CELL_REFERENCE_RX)?.[0]

            return cellReferenceMatch ? getCellValueByRef(cellReferenceMatch) : token
        })
        const mathExp = tokensWithCellValues.join('')

        messagePort.current.postMessage({
            type: FORMULA_CALCULATE_MESSAGE_TYPE,
            mathExp,
            cellRef,
        })
    }

    return {
        parseFormula,
    }
}
