import PropTypes from 'prop-types'
import nookies from 'nookies'
import { firebaseAdmin } from '../utils/firebase/firebaseAdmin'
import { firebaseClient } from '../utils/firebase/firebaseClient'
import usePagination from 'firestore-pagination-hook'
import useAuth from '../utils/hooks/useAuth'

import Skeleton from 'react-loading-skeleton'

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

const Dashboard = ({ uid }) => {
    // Wait for firebaseClient to initialize db (if loading /dashboard directly), then make usePagination query
    const db = firebaseClient.apps.length && firebaseClient.firestore()
    const {
        loading,
        loadingError,
        loadingMore,
        loadingMoreError,
        hasMore,
        items,
        loadMore,
    } = usePagination(db && db.collection('users').where('uid', '==', uid))
    const data = items?.[0]?.data()

    return (
        <div>
            {data ? data.balance : <Skeleton />}
            <style jsx>{``}</style>
        </div>
    )
}

Dashboard.propTypes = {
    uid: PropTypes.string,
}

export default Dashboard
