import Head from 'next/head'

import Layout from '../components/Layout/Layout'

import './styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css' // Import the CSS
config.autoAddCss = false // Tell Font Awesome to skip adding the CSS automatically since it's being imported above

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps }) => {
    return (
        <Layout>
            <Head>
                <link
                    rel="icon"
                    href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/248/leaf-fluttering-in-wind_1f343.png"
                />
            </Head>
            <Component {...pageProps} />
        </Layout>
    )
}

export default App
