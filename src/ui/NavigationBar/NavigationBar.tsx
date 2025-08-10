import { Menu } from 'antd'
import { matchRoutes, useLocation, useNavigate } from 'react-router'

import { routes } from 'core/router'
import type { MenuInfo } from 'types/App'
import { menuItems } from 'ui/NavigationBar/utils'

import styles from './NavigationBar.module.scss'

export const NavigationBar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const matches = matchRoutes(routes, location)
    const selectedMenuKeys =
        matches?.map((match) => {
            return `/${match.route.path?.split('/')[1]}`
        }) ?? []

    const handleMenuClick = ({ key }: MenuInfo) => {
        navigate(key)
    }

    return (
        <Menu
            onClick={handleMenuClick}
            selectedKeys={selectedMenuKeys}
            mode="horizontal"
            items={menuItems}
            className={styles.accountNavigation}
        />
    )
}
