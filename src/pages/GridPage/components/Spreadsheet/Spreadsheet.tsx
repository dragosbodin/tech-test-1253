import type { ColDef } from 'ag-grid-community'
import { themeQuartz } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'
import { useState } from 'react'

import { alphabetLetters, mockData } from 'mocks/mockData'
import variables from 'styles/variables.module.scss'

import styles from './Spreadsheet.module.scss'

const { colorPrimary, fontFamilyPrimary, fontFamilyHeading } = variables

export const Spreadsheet = () => {
    const [colDefs] = useState<ColDef<Record<string, number>>[]>(
        alphabetLetters.map((letter): ColDef<Record<string, number>> => {
            return {
                field: letter,
                headerName: letter,
                editable: true,
                resizable: true,
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
                })}
                rowData={mockData}
                columnDefs={colDefs}
            />
        </div>
    )
}
