import type { GridApi } from 'ag-grid-community'
import { evaluate } from 'mathjs'

import type { SpreadsheetRecord } from 'types/SpreadsheetRecord'

const OPERATORS = ['+', '-', '*', '/']
const CELL_REFERENCE_RX = /^[A-Z][0-9]+$/g

export const formula = (formulaStr: string, gridApi: GridApi<SpreadsheetRecord>) => {
    const parse = () => {
        const formula = `${formulaStr}`

        if (!formula.startsWith('=')) return false

        const mathExp = formula.trim().replace(/([ =])/g, '')
        return mathExp.split(/([+\-*/])/g).every((token) => {
            return !!token.match(CELL_REFERENCE_RX)?.[0] || OPERATORS.includes(token)
        })
    }

    const getCellValue = (ref: string) => {
        if (!CELL_REFERENCE_RX.test(ref)) {
            throw new Error(`Invalid cell reference ${ref}`)
        }

        const [letter, ...rowIdx] = ref
        const parsedRowIdx = parseInt(rowIdx.join('')) - 1

        const rowAtIdx = gridApi.getDisplayedRowAtIndex(parsedRowIdx)
        if (!rowAtIdx) {
            throw new Error(`Invalid row reference ${ref}`)
        }

        return rowAtIdx.data?.[letter]
    }

    const calculate = () => {
        const formula = `${formulaStr}`
        const tokensWithCellValues = formula
            .trim()
            .replace(/([ =])/g, '')
            .split(/([+\-*/])/g)
            .map((token) => {
                const cellReferenceMatch = token.match(CELL_REFERENCE_RX)?.[0]

                return cellReferenceMatch ? getCellValue(cellReferenceMatch) : token
            })
        const mathExp = tokensWithCellValues.join('')

        return evaluate(mathExp)
    }

    return {
        parse,
        calculate,
    }
}
