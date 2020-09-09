import PropTypes from 'prop-types'
import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
    return (
        <div className="page-layout">
            <Header />
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
