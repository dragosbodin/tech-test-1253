import {
    LineChartOutlined,
    ProjectOutlined,
    TableOutlined,
    UserOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'

import { paths } from 'core/router/paths'

export const menuItems: MenuProps['items'] = [
    {
        label: 'my account',
        key: '/my-account',
        icon: <UserOutlined />,
    },
    {
        label: 'grid',
        key: paths.grid,
        icon: <TableOutlined />,
    },
    {
        label: 'charts',
        key: '/charts',
        icon: <LineChartOutlined />,
        children: [
            {
                type: 'group',
                label: 'Item 1',
                children: [
                    {
                        label: 'Option 1',
                        key: 'setting:1',
                    },
                    {
                        label: 'Option 2',
                        key: 'setting:2',
                    },
                ],
            },
            {
                type: 'group',
                label: 'Item 2',
                children: [
                    {
                        label: 'Option 3',
                        key: 'setting:3',
                    },
                    {
                        label: 'Option 4',
                        key: 'setting:4',
                    },
                ],
            },
        ],
    },
    {
        label: 'analyse',
        key: '/analysis',
        icon: <ProjectOutlined />,
    },
]
