import Head from 'next/head'
import PropTypes from 'prop-types'
import nookies from 'nookies'
import { firebaseAdmin } from '../utils/firebaseAdmin'
import useAuth from '../utils/hooks/useAuth'

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
        // either the `token` cookie didn't exist or token verification failed
        // either way: redirect to the login page
        ctx.res.writeHead(302, { Location: '/login' }).end()
        return { props: {} }
    }
}

const Profile = () => {
    const { user, logout } = useAuth()

    return (
        <div>
            <Head>
                <title>Mintly | Profile</title>
            </Head>
            <h1>Profile</h1>
            {user && (
                <>
                    <p
                        style={{
                            display: 'inline-block',
                            color: 'blue',
                            cursor: 'pointer',
                        }}
                        onClick={() => logout()}
                    >
                        Log out
                    </p>
                    <p>Profile:</p>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </>
            )}
            <style jsx>{``}</style>
        </div>
    )
}

export default Profile
