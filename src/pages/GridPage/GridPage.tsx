import { Spreadsheet } from 'pages/GridPage/components/Spreadsheet'
import { PageTitle } from 'ui/PageTitle'

export const GridPage = () => {
    return (
        <>
            <PageTitle title="Spreadsheet" heading="React AG Grid" backLink="/" />
            <div className="page">
                <Spreadsheet />
            </div>
        </>
    )
}
