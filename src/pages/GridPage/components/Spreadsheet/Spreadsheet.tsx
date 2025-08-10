import type { ColDef, ValueSetterFunc } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef, useState } from 'react'

import { useFormulaWorker } from 'core/hooks/useFormulaWorker'
import { alphabetLetters, mockData } from 'mocks/mockData'
import variables from 'styles/variables.module.scss'
import type { SpreadsheetRecord } from 'types/SpreadsheetRecord'

import styles from './Spreadsheet.module.scss'

const { colorPrimary, colorInfo, fontFamilyPrimary, fontFamilyHeading } = variables

export const Spreadsheet = () => {
    const gridRef = useRef<AgGridReact<SpreadsheetRecord>>(null)
    const [gridReady, setGridReady] = useState(false)
    const { parseFormula } = useFormulaWorker(gridRef.current?.api ?? null, gridReady)

    const valueSetter: ValueSetterFunc<SpreadsheetRecord> = ({
        newValue,
        oldValue,
        column,
        data,
        node,
    }) => {
        if (newValue === oldValue) return false

        const colId = column.getColId()

        if (String(newValue).startsWith('=')) {
            const rowIdx = (node?.rowIndex ?? 0) + 1
            parseFormula(String(newValue), `${colId}${rowIdx}`)
        } else {
            data[colId] = newValue
        }

        return true
    }

    const [colDefs] = useState<ColDef<SpreadsheetRecord>[]>(
        alphabetLetters.map((letter): ColDef<SpreadsheetRecord> => {
            return {
                field: letter,
                headerName: letter,
                editable: true,
                resizable: true,
                cellDataType: false,
                valueSetter,
                onCellValueChanged: ({ data, node, newValue, oldValue }) => {
                    console.log('onCellValueChanged', newValue === oldValue)
                    if (newValue !== oldValue) {
                        node?.setDataValue(letter, data[letter])
                    }
                },
            }
        })
    )

    return (
        <div className={styles.spreadsheet}>
            <AgGridReact
                theme={themeQuartz.withParams({
                    accentColor: colorPrimary,
                    fontFamily: fontFamilyPrimary,
                    cellFontFamily: fontFamilyPrimary,
                    headerFontFamily: fontFamilyHeading,
                    oddRowBackgroundColor: colorInfo,
                })}
                rowData={mockData}
                columnDefs={colDefs}
                ref={gridRef}
                onGridReady={() => setGridReady(true)}
            />
        </div>
    )
}
