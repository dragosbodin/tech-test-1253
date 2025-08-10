/// <reference lib ="WebWorker" />
/// <reference lib ="ESNext" />

import { evaluate } from 'mathjs'

import { CELL_REFERENCE_RX, NUMERIC_RX, OPERATORS } from 'constants/formula'
import {
    FORMULA_CALCULATE_COMPLETE_MESSAGE_TYPE,
    FORMULA_CALCULATE_MESSAGE_TYPE,
    FORMULA_CLOSE_MESSAGE_TYPE,
    FORMULA_PARSE_COMPLETE_MESSAGE_TYPE,
    FORMULA_PARSE_MESSAGE_TYPE,
    type FormulaWorkerReceivableMessages,
    type OpenFormulaMessage,
} from 'types/FormulaWorker'

const validateOpenMessageEvent = (
    ev: MessageEvent
): ev is MessageEvent<OpenFormulaMessage> => {
    if (ev.data?.type !== 'open') return false
    return ev.data?.port instanceof MessagePort
}

self.onmessage = async (ev: MessageEvent) => {
    if (validateOpenMessageEvent(ev)) {
        const { port } = ev.data
        port.onmessage = (ev: MessageEvent<FormulaWorkerReceivableMessages>) => {
            const type = ev.data.type

            switch (type) {
                case FORMULA_PARSE_MESSAGE_TYPE: {
                    const { formula, cellRef } = ev.data

                    parseFormula(formula, cellRef)

                    return
                }
                case FORMULA_CALCULATE_MESSAGE_TYPE: {
                    const { mathExp, cellRef } = ev.data

                    calculateFormula(mathExp, cellRef)

                    return
                }
                case FORMULA_CLOSE_MESSAGE_TYPE: {
                    port.close()

                    return
                }
                default: {
                    throw new Error(
                        `Invalid receivable message type ${type satisfies never}`
                    )
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
                type: FORMULA_PARSE_COMPLETE_MESSAGE_TYPE,
                isValid,
                parsedFormula: mathExp,
                cellRef,
            })
        }

        const calculateFormula = (mathExp: string, cellRef: string) => {
            try {
                const result = evaluate(mathExp)
                port.postMessage({
                    type: FORMULA_CALCULATE_COMPLETE_MESSAGE_TYPE,
                    result,
                    cellRef,
                })
            } catch (err) {
                console.error(err)
                port.postMessage({
                    type: FORMULA_CALCULATE_COMPLETE_MESSAGE_TYPE,
                    result: null,
                    cellRef,
                })
            }
        }
    } else {
        throw new Error(
            `Invalid message with type ${ev.data?.type} sent to formula worker`
        )
    }
}
