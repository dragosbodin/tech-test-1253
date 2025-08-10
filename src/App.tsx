import { ConfigProvider, type ThemeConfig } from 'antd'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { Outlet } from 'react-router'

import './styles/globals.scss'

import variables from './styles/variables.module.scss'

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

const {
    colorPrimary,
    // colorPrimaryHover,
    // colorPrimaryActive,
    colorInfo,
    colorInfoBg,
    colorWarning,
    textPrimary,
    textSecondary,
} = variables
const themeConfig: ThemeConfig = {
    hashed: false,
    token: {
        colorPrimary,
        colorLink: colorPrimary,
        colorWarning,
        borderRadius: 4,
        colorText: textPrimary,
        colorTextSecondary: textSecondary,
        fontFamily: "'Lato', sans-serif",
        colorFillTertiary: colorInfo,
    },
    components: {
        Tooltip: {
            colorBgSpotlight: colorInfoBg,
            colorTextLightSolid: 'black',
        },
        Alert: {
            colorInfo: 'black',
            colorInfoBorder: colorPrimary,
            colorInfoBg: colorInfoBg,
        },
    },
}

export const App = () => {
    return (
        <ConfigProvider theme={themeConfig}>
            <Outlet />
        </ConfigProvider>
    )
}
