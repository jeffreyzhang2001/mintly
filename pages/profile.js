import PropTypes from 'prop-types'
import { useState } from 'react'

import nookies from 'nookies'
import { firebaseAdmin } from '../utils/firebaseAdmin'
import { firebaseClient } from '../utils/firebaseClient'
import usePagination from 'firestore-pagination-hook'
import useAuth from '../utils/hooks/useAuth'

import cn from 'classnames'
import { Button, Avatar, Divider, Modal } from 'antd'
import { UserOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
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

    const [isAddingPortfolio, setIsAddingPortfolio] = useState(false)
    const addPortfolio = () => {
        setIsAddingPortfolio(true)
        const res = firebaseClient
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
                {
                    portfolios: firebaseClient.firestore.FieldValue.arrayUnion({
                        createdAt: firebaseClient.firestore.Timestamp.fromDate(
                            new Date(),
                        ),
                        balance: 10000,
                    }),
                },
                { merge: true },
            )
            .then((res) => setIsAddingPortfolio(false))
    }

    const [isDeletingPortfolio, setIsDeletingPortfolio] = useState(false)
    const deletePortfolio = (toDeleteIndex) => {
        setIsDeletingPortfolio(true)
        const res = firebaseClient
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
                {
                    portfolios: data.portfolios.filter(
                        (portfolio, index) => index !== toDeleteIndex,
                    ),
                },
                { merge: true },
            )
            .then((res) => setIsDeletingPortfolio(false))
    }

    const [isMakingDefault, setIsMakingDefault] = useState(false)
    const makeDefault = (newDefaultIndex) => {
        setIsMakingDefault(true)
        const res = firebaseClient
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
                {
                    defaultPortfolioIndex: newDefaultIndex,
                },
                { merge: true },
            )
            .then((res) => setIsMakingDefault(false))
    }

    return (
        <div className="container">
            <main>
                {user && (
                    <div className="profile">
                        <div className="userinfo-container">
                            <Avatar
                                shape="circle"
                                src={photoURL}
                                icon={<UserOutlined />}
                                size={120}
                            />
                            <div className="usertext">
                                <h1 className="name">{displayName}</h1>
                                {data ? (
                                    <h2 className="total-balance">{`Total Balance: $${data.balance}`}</h2>
                                ) : (
                                    <h2>
                                        <Skeleton />
                                    </h2>
                                )}
                            </div>
                            <div className="buttons-container">
                                <Button
                                    className="destructive-button"
                                    onClick={() => logout()}
                                    type="primary"
                                >
                                    Log Out
                                </Button>
                            </div>
                        </div>
                        <div className="section-title">
                            <h1 className="name">Portfolios</h1>
                            <Button
                                className={cn(
                                    'primary-button',
                                    'add-portfolio-button',
                                )}
                                onClick={() => addPortfolio()}
                                loading={isAddingPortfolio}
                                type="primary"
                            >
                                Add Portfolio
                            </Button>
                        </div>
                        <Divider className="divider" />
                        {data ? (
                            <div className="portfolios">
                                {data.portfolios.map((portfolio, index) => {
                                    const isDefault =
                                        index === data.defaultPortfolioIndex
                                    return (
                                        <div
                                            className="portfolio-container"
                                            key={index}
                                        >
                                            <div>
                                                <h1>{`Portfolio ${index + 1}${
                                                    isDefault
                                                        ? ' (Default)'
                                                        : ''
                                                }`}</h1>
                                                <h2>
                                                    Total Value:{' '}
                                                    <span>
                                                        ${portfolio.balance}
                                                    </span>
                                                </h2>
                                                <h2>
                                                    Total Equity:{' '}
                                                    <span>
                                                        ${portfolio.balance}
                                                    </span>
                                                </h2>
                                                <h2>
                                                    Total Cash:{' '}
                                                    <span>
                                                        ${portfolio.balance}
                                                    </span>
                                                </h2>
                                            </div>
                                            <div
                                                className={cn(
                                                    'buttons-container',
                                                    'portfolio-buttons',
                                                )}
                                            >
                                                {!isDefault && (
                                                    <>
                                                        <Button
                                                            className="destructive-button"
                                                            onClick={() => {
                                                                Modal.confirm({
                                                                    title:
                                                                        'Delete Portfolio',
                                                                    icon: (
                                                                        <ExclamationCircleOutlined />
                                                                    ),
                                                                    content: `Are you sure you want to delete this portfolio?`,
                                                                    centered: true,
                                                                    maskClosable: true,
                                                                    okText:
                                                                        'Delete',
                                                                    okButtonProps: {
                                                                        className:
                                                                            'destructive-button',
                                                                    },
                                                                    onOk: () =>
                                                                        deletePortfolio(
                                                                            index,
                                                                        ),
                                                                    cancelText:
                                                                        'Cancel',
                                                                    cancelButtonProps: {
                                                                        className:
                                                                            'modal-cancel-button',
                                                                        type:
                                                                            'primary',
                                                                    },
                                                                })
                                                            }}
                                                            disabled={isDefault}
                                                            type="primary"
                                                        >
                                                            Delete Portfolio
                                                        </Button>
                                                        <Button
                                                            className="primary-button"
                                                            onClick={() =>
                                                                makeDefault(
                                                                    index,
                                                                )
                                                            }
                                                            loading={false}
                                                            type="primary"
                                                        >
                                                            Make Default
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            [...Array(3)].map((x, i) => (
                                <div className="skeleton-container" key={i}>
                                    <h1>
                                        <Skeleton width={250} />
                                    </h1>
                                    <h2>
                                        <Skeleton width={500} count={3} />
                                    </h2>
                                </div>
                            ))
                        )}
                        <Divider className={cn('divider', 'bottom-divider')} />
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
                    padding: 4rem 0;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    // justify-content: center;
                    align-items: center;
                }

                .profile {
                    width: 55%;
                }

                .userinfo-container,
                .portfolio-container,
                .skeleton-container {
                    display: flex;
                }

                .name {
                    font-size: 45px;
                }
                .total-balance {
                    font-size: 28px;
                }

                .section-title {
                    display: flex;
                    align-items: center;
                    margin-top: 35px;
                    margin-right: auto;
                }

                :global(.divider) {
                    margin-top: 0;
                    margin-bottom: 10px;
                    color: white;
                    border-color: white;
                }
                :global(.bottom-divider) {
                    margin-top: 15px;
                }

                .portfolios {
                    height: 50vh;
                    overflow: auto;
                    scrollbar-color: white;
                }
                .portfolios::-webkit-scrollbar {
                    background: white;
                    width: 0.4em;
                    border-radius: 15px;
                }
                .portfolios::-webkit-scrollbar-thumb {
                    background-color: gray;
                    border-radius: 15px;
                }
                .portfolio-container:not(:first-of-type) {
                    margin-top: 15px;
                }

                .skeleton-container {
                    margin-top: 15px;
                    flex-direction: column;
                }

                .usertext {
                    margin-left: 30px;
                }

                .buttons-container {
                    display: flex;
                    margin-top: 20px;
                    margin-left: auto;
                }
                .portfolio-buttons {
                    margin-top: 10px;
                    margin-right: 10px;
                }

                :global(.primary-button, .destructive-button, .modal-cancel-button) {
                    height: 40px;
                    border-radius: 8px;
                }
                :global(.primary-button) {
                    margin-left: 12px;
                }
                :global(.destructive-button) {
                    background-color: #ff7e67 !important;
                    border-color: #ff7e67 !important;
                }
                :global(.destructive-button):hover {
                    background-color: #931a25 !important;
                    border-color: #931a25 !important;
                }

                :global(.modal-cancel-button) {
                    background-color: white !important;
                    border-color: gray !important;
                }
                :global(.modal-cancel-button):hover {
                    background-color: #cdcdcd !important;
                    border-color: gray !important;
                }
                :global(.add-portfolio-button) {
                    margin-left: auto;
                }

                h1,
                h2 {
                    margin-bottom: 0;
                    font-weight: 600;
                }
                h1 {
                    font-size: 35px;
                }
                h2 {
                    color: #c7c3bd;
                }

                span {
                    color: white;
                }

                @media only screen and (max-width: 600px) {
                    .userinfo-container,
                    .portfolio-container {
                        flex-direction: column;
                        align-items: center;
                        width: 90%;
                    }
                    .portfolio-buttons {
                        flex-direction: column;
                        align-items: center;
                    }
                    .skeleton-container {
                        display: none;
                    }
                    .buttons-container {
                        margin-left: 0;
                    }
                    h1 {
                        margin: 0;
                    }
                }
            `}</style>
        </div>
    )
}

Profile.propTypes = {
    uid: PropTypes.string,
}

export default Profile
