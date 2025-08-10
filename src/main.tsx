import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router'

import { router } from 'core/router'

ModuleRegistry.registerModules([AllCommunityModule])
;(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    )
})()
