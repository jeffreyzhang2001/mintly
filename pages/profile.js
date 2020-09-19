import PropTypes from 'prop-types'
import nookies from 'nookies'
import { firebaseAdmin } from '../utils/firebaseAdmin'
import { firebaseClient } from '../utils/firebaseClient'
import usePagination from 'firestore-pagination-hook'
import useAuth from '../utils/hooks/useAuth'

import { Button, Avatar } from 'antd'
import { UserOutlined } from '@ant-design/icons'
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

const Profile = ({ uid }) => {
    const { user, logout } = useAuth()
    const { displayName, photoURL } = user || {}

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
        <div className="container">
            <main>
                {user && (
                    <div className="userinfo-container">
                        <Avatar
                            shape="circle"
                            src={photoURL}
                            icon={<UserOutlined />}
                            size={120}
                        />
                        <div className="usertext">
                            <h1>{displayName}</h1>
                            {data ? (
                                <h2>{`Total Balance: $${data.balance}`}</h2>
                            ) : (
                                <Skeleton height={25} />
                            )}
                        </div>
                        <Button
                            className="logout-button"
                            onClick={() => logout()}
                            type="primary"
                        >
                            Log Out
                        </Button>
                    </div>
                )}
            </main>
            <style jsx>{`
                .container {
                    min-height: calc(100vh - 3.75rem);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                main {
                    padding: 8rem 0;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .userinfo-container {
                    width: 55%;
                    display: flex;
                }
                .user-text {
                    display: flex;
                }

                :global(.logout-button) {
                    margin-top: 5px;
                    margin-left: auto;
                    height: 40px;
                    border-radius: 8px;
                    background-color: #ff7e67 !important;
                    border-color: #ff7e67 !important;
                }
                :global(.logout-button):hover {
                    background-color: #931a25 !important;
                    border-color: #931a25 !important;
                }

                h1,
                h2 {
                    margin-bottom: 0;
                    margin-left: 30px;
                }
                h1 {
                    font-size: 32px;
                }

                @media only screen and (max-width: 600px) {
                    .userinfo-container {
                        flex-direction: column;
                        align-items: center;
                        width: 90%;
                    }
                    h1 {
                        margin: 0;
                    }
                    :global(.logout-button) {
                        margin-left: 0;
                    }
                }

                :global(.react-loading-skeleton) {
                    margin-left: 30px;
                }
            `}</style>
        </div>
    )
}

Profile.propTypes = {
    uid: PropTypes.string,
}

export default Profile
