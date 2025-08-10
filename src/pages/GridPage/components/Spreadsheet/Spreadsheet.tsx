import type { ColDef } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useState } from 'react'
import { formula } from 'utils/formula'

import { alphabetLetters, mockData } from 'mocks/mockData'
import variables from 'styles/variables.module.scss'
import type { SpreadsheetRecord } from 'types/SpreadsheetRecord'

import styles from './Spreadsheet.module.scss'

const { colorPrimary, colorInfo, fontFamilyPrimary, fontFamilyHeading } = variables

export const Spreadsheet = () => {
    const [colDefs] = useState<ColDef<SpreadsheetRecord>[]>(
        alphabetLetters.map((letter): ColDef<SpreadsheetRecord> => {
            return {
                field: letter,
                headerName: letter,
                editable: true,
                resizable: true,
                cellDataType: false,
                valueSetter: ({ api, newValue, oldValue, column, data }) => {
                    if (newValue === oldValue) return false

                    const colId = column.getColId()
                    const valueFormula = formula(String(newValue), api)

                    if (valueFormula.parse()) {
                        data[colId] = valueFormula.calculate()
                    } else {
                        data[colId] = newValue
                    }

                    return true
                },
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
            />
        </div>
    )
}
