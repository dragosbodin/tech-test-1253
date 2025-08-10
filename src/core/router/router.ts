import { createBrowserRouter } from 'react-router'

import { BASE_PATH } from 'constants/config'

import { routes } from './routes'

export const router = createBrowserRouter(routes, {
    basename: BASE_PATH,
})
