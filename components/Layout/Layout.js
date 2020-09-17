import PropTypes from 'prop-types'
import Header from './Header'
import Footer from './Footer'
import NextNProgress from '../NProgress'

const Layout = ({ children }) => {
    return (
        <div className="page-layout">
            <Header />
            <NextNProgress />
            {children}
            <Footer />

            <style jsx global>
                {``}
            </style>
        </div>
    )
}

Layout.propTypes = {
    children: PropTypes.node,
}

export default Layout
