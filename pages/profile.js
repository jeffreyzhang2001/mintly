import PropTypes from 'prop-types'
import nookies from 'nookies'
import { firebaseAdmin } from '../utils/firebaseAdmin'
import { firebaseClient } from '../utils/firebaseClient'
import usePagination from 'firestore-pagination-hook'
import useAuth from '../utils/hooks/useAuth'

export const getServerSideProps = async (ctx) => {
    try {
        const cookies = nookies.get(ctx)
        const token = await firebaseAdmin.auth().verifyIdToken(cookies.token)
        const { uid, email } = token

        return { props: { uid } }
    } catch (err) {
        // either the `token` cookie didn't exist or token verification failed
        ctx.res.writeHead(302, { Location: '/login' }).end()
        return { props: {} }
    }
}

const Profile = ({ uid }) => {
    const { user, logout } = useAuth()
    const { displayName, photoURL } = user || {}

    return (
        <div>
            <h1>Profile</h1>
            {user && (
                <>
                    <a
                        style={{
                            display: 'inline-block',
                            color: 'blue',
                            cursor: 'pointer',
                        }}
                        onClick={() => logout()}
                    >
                        Log out
                    </a>
                    {displayName}
                    {photoURL}
                </>
            )}
            <style jsx>{``}</style>
        </div>
    )
}

Profile.propTypes = {
    uid: PropTypes.string,
}

export default Profile
