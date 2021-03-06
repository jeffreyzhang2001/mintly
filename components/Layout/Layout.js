import PropTypes from 'prop-types'
import Header from './Header'
import Footer from './Footer'

import NextNProgress from '../NProgress'
import { SkeletonTheme } from 'react-loading-skeleton'

const Layout = ({ children }) => {
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

                    .skeleton-container {
                        display: none;
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
