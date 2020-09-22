import PropTypes from 'prop-types'
import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

import { notification } from 'antd'
import NextNProgress from '../NProgress'
import { SkeletonTheme } from 'react-loading-skeleton'
import Twemoji from 'react-twemoji'

const Layout = ({ children }) => {
    useEffect(() => {
        notification['info']({
            message: 'Hi, thanks for visiting!',
            description:
                'Mintly is actively being developed. New features are added every day!',
            duration: 4,
            placement: 'bottomRight',
            icon: (
                <Twemoji options={{ className: 'notification-emoji' }}>
                    🍃
                </Twemoji>
            ),
        })
    }, [])

    return (
        <div className="page-layout">
            <Header />
            <NextNProgress />
            <SkeletonTheme color="#202020" highlightColor="#444">
                {children}
            </SkeletonTheme>
            <Footer />

            <style jsx global>
                {`
                    .notification-emoji {
                        height: 50px;
                        width: 60px;
                        margin-top: 10px;
                        margin-left: -30%;
                        padding-right: 10px;
                    }
                `}
            </style>
        </div>
    )
}

Layout.propTypes = {
    children: PropTypes.node,
}

export default Layout
