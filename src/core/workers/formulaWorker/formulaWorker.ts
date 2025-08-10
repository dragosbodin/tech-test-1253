/// <reference lib ="WebWorker" />
/// <reference lib ="ESNext" />

import { evaluate } from 'mathjs'

import { CELL_REFERENCE_RX, NUMERIC_RX, OPERATORS } from 'constants/formula'

self.onmessage = async (ev: MessageEvent) => {
    const { port } = ev.data
    port.onmessage = (ev: MessageEvent) => {
        const type = ev.data.type

        switch (type) {
            case 'parse': {
                const { formula, cellRef } = ev.data

                parseFormula(formula, cellRef)

                return
            }
            case 'calculate': {
                const { mathExp, cellRef } = ev.data

                calculateFormula(mathExp, cellRef)

                return
            }
            case 'close': {
                port.close()

                return
            }
        }
    }

    const parseFormula = (formula: string, cellRef: string) => {
        const mathExp = formula.trim().replace(/([ =])/g, '')
        const isValid = mathExp.split(/([+\-*/])/g).every((token) => {
            return (
                !!token.match(CELL_REFERENCE_RX)?.[0] ||
                !!token.match(NUMERIC_RX)?.[0] ||
                OPERATORS.includes(token)
            )
        })

        port.postMessage({
            type: 'parse-complete',
            isValid,
            parsedFormula: mathExp,
            cellRef,
        })
    }

    const calculateFormula = (mathExp: string, cellRef: string) => {
        try {
            const result = evaluate(mathExp)
            port.postMessage({
                type: 'calculate-complete',
                result,
                cellRef,
            })
        } catch (err) {
            console.error(err)
            port.postMessage({
                type: 'calculate-complete',
                result: null,
                cellRef,
            })
        }
    }
}
