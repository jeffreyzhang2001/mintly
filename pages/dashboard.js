import Head from 'next/head'
import PropTypes from 'prop-types'
import nookies from 'nookies'
import { firebaseAdmin } from '../utils/firebaseAdmin'

export const getServerSideProps = async (ctx) => {
    try {
        const cookies = nookies.get(ctx)
        const token = await firebaseAdmin.auth().verifyIdToken(cookies.token)
        const { uid, email } = token

        return {
            props: {
                message: `Your email is ${email} and your UID is ${uid}.`,
            },
        }
    } catch (err) {
        console.log(err)
        // either the `token` cookie didn't exist or token verification failed
        // either way: redirect to the login page
        ctx.res.writeHead(302, { Location: '/login' }).end()
        return { props: {} }
    }
}

const Dashboard = ({ message }) => {
    return (
        <div>
            <Head>
                <title>Mintly | Dashboard</title>
            </Head>
            <h1>Dashboard</h1>
            {/* {user && (
                <>
                    <p>Profile:</p>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </>
            )} */}
            <style jsx>{``}</style>
        </div>
    )
}

Dashboard.propTypes = {
    message: PropTypes.string,
}

export default Dashboard
