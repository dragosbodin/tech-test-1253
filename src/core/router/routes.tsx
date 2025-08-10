import { Navigate, type RouteObject } from 'react-router'

import { App } from 'src/App'
import { Layout } from 'src/ui/Layout'
import { paths } from 'core/router/paths'
import { GridPage } from 'pages/GridPage'

export const routes: RouteObject[] = [
    {
        path: '*',
        element: <Navigate to={paths.grid} replace />,
    },
    {
        element: <App />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        path: paths.grid,
                        element: <GridPage />,
                    },
                ],
            },
        ],
    },
]
