import type { ColDef, ValueGetterFunc, ValueSetterFunc } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useRef, useState } from 'react'

import { useFormulaWorker } from 'core/hooks/useFormulaWorker'
import { useSyncWorker } from 'core/hooks/useSyncWorker'
import { alphabetLetters, mockData } from 'mocks/mockData'
import variables from 'styles/variables.module.scss'
import type { SpreadsheetRecord } from 'types/SpreadsheetRecord'

import styles from './Spreadsheet.module.scss'

const { colorPrimary, colorInfo, colorDestroy, fontFamilyPrimary, fontFamilyHeading } =
    variables

export const Spreadsheet = () => {
    const [rowData, setRowData] = useState<SpreadsheetRecord[]>(mockData)
    const syncTabState = useSyncWorker(mockData, setRowData, 'id')
    const gridRef = useRef<AgGridReact<SpreadsheetRecord>>(null)
    const [gridReady, setGridReady] = useState(false)
    const { parseFormula } = useFormulaWorker(gridRef.current?.api ?? null, gridReady)

    const recordValueSetter: ValueSetterFunc<SpreadsheetRecord> = ({
        newValue,
        oldValue,
        column,
        data,
        node,
        api,
    }) => {
        if (newValue === oldValue) return false

        const colId = column.getColId()

        if (String(newValue).startsWith('=')) {
            const rowIdx = (node?.rowIndex ?? 0) + 1
            parseFormula(String(newValue), `${colId}${rowIdx}`)
        } else {
            if (node != null && newValue < 0) {
                api.flashCells({ columns: [column], rowNodes: [node] })
            }
            data[colId] = newValue
        }

        return true
    }

    const rowIndexValueGetter: ValueGetterFunc = ({ node }) => {
        return (node?.rowIndex ?? 0) + 1
    }

    const [colDefs] = useState<ColDef<SpreadsheetRecord>[]>([
        {
            field: 'rowIndex',
            headerName: '#',
            valueGetter: rowIndexValueGetter,
            sortable: false,
            width: 60,
            pinned: 'left',
        },
        ...alphabetLetters.map((letter): ColDef<SpreadsheetRecord> => {
            return {
                field: letter,
                headerName: letter,
                editable: true,
                resizable: true,
                cellDataType: false,
                valueSetter: recordValueSetter,
            }
        }),
    ])

    return (
        <div className={styles.spreadsheet}>
            <AgGridReact
                theme={themeQuartz.withParams({
                    accentColor: colorPrimary,
                    oddRowBackgroundColor: colorInfo,
                    valueChangeValueHighlightBackgroundColor: colorDestroy,
                    fontFamily: fontFamilyPrimary,
                    cellFontFamily: fontFamilyPrimary,
                    headerFontFamily: fontFamilyHeading,
                })}
                rowData={rowData}
                columnDefs={colDefs}
                ref={gridRef}
                onGridReady={() => setGridReady(true)}
                onCellValueChanged={(_ev) => {
                    syncTabState(rowData)
                }}
            />
        </div>
    )
}
