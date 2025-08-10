import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { Link, Outlet } from 'react-router'

import { paths } from 'core/router/paths'
import { NavigationBar } from 'ui/NavigationBar'

import styles from './Layout.module.scss'

export const Layout = () => {
    return (
        <>
            <NavigationBar />
            <div className={styles.layout}>
                <div className={styles.sidebar}>
                    <Link to={paths.grid} className={styles.sidebar__logo}>
                        <img
                            src="/logo.svg"
                            alt="React Express Starter"
                            className={styles.sidebar__logoImage}
                        />
                    </Link>
                    <div className={styles.sidebar__actions}>
                        <div className={styles.sidebar__action}>
                            <Button type="text" icon={<UserOutlined />} size="large" />
                        </div>
                        <div className={styles.sidebar__action}>
                            <Button type="text" icon={<LogoutOutlined />} size="large" />
                        </div>
                    </div>
                </div>
                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </>
    )
}
