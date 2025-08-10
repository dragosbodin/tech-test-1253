import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, Col, Row } from 'antd'
import { Link } from 'react-router'

import styles from './PageTitle.module.scss'

type PageTitleProps = {
    title: string
    heading?: string
    backLink?: string
}

export const PageTitle = ({ title, heading, backLink }: PageTitleProps) => {
    return (
        <>
            <h1 className={styles.pageTitle__side}>{title}</h1>
            {(heading || backLink) && (
                <Row className={styles.pageTitle__heading} align="middle">
                    <Col flex="100px">
                        {backLink && (
                            <Link to={backLink}>
                                <Button
                                    type="link"
                                    block
                                    icon={<ArrowLeftOutlined />}
                                    className={styles.pageTitle__action}
                                >
                                    back
                                </Button>
                            </Link>
                        )}
                    </Col>
                    <Col flex="auto">
                        {heading && (
                            <h2 className={styles.pageTitle__subheading}>{heading}</h2>
                        )}
                    </Col>
                    <Col flex="100px" />
                </Row>
            )}
        </>
    )
}
