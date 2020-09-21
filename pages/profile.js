import PropTypes from 'prop-types'
import { useState } from 'react'

import nookies from 'nookies'
import { firebaseAdmin } from '../utils/firebase/firebaseAdmin'
import { firebaseClient } from '../utils/firebase/firebaseClient'
import usePagination from 'firestore-pagination-hook'
import useAuth from '../utils/hooks/useAuth'

import cn from 'classnames'
import { Button, Avatar, Divider, Modal } from 'antd'
import {
    UserOutlined,
    ExclamationCircleOutlined,
    PlusCircleOutlined,
    StarOutlined,
    StarFilled,
} from '@ant-design/icons'
import Skeleton from 'react-loading-skeleton'

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
    const firestoreData = items?.[0]?.data()
    const { totalBalance, totalEquity, portfolioData } = firestoreData || {}

    const addPortfolio = () => {
        const res = firebaseClient
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
                {
                    portfolioData: {
                        portfolios: firebaseClient.firestore.FieldValue.arrayUnion(
                            {
                                createdAt: firebaseClient.firestore.Timestamp.fromDate(
                                    new Date(),
                                ),
                                name: `Portfolio ${
                                    portfolioData.portfolios.length + 1
                                }`,
                                balance: 10000,
                                equity: 0,
                            },
                        ),
                    },
                },
                { merge: true },
            )
            .then((res) => {})
    }

    const deletePortfolio = (toDeleteIndex) => {
        const res = firebaseClient
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
                {
                    portfolioData: {
                        portfolios: portfolioData.portfolios.filter(
                            (portfolio, index) => index !== toDeleteIndex,
                        ),
                    },
                },
                { merge: true },
            )
            .then((res) => {})
    }

    const makeDefault = (newDefaultIndex) => {
        const res = firebaseClient
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
                {
                    portfolioData: {
                        defaultPortfolioIndex: newDefaultIndex,
                    },
                },
                { merge: true },
            )
            .then((res) => {})
    }

    const injectMoney = (index, amount) => {
        let currentPortfolios = [...portfolioData.portfolios]
        currentPortfolios[index] = {
            ...currentPortfolios[index],
            balance: currentPortfolios[index].balance + amount,
        }

        const res = firebaseClient
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
                {
                    totalBalance: totalBalance + amount,
                    portfolioData: {
                        portfolios: currentPortfolios,
                    },
                },
                { merge: true },
            )
            .then((res) => {})
    }

    return (
        <div className="profile">
            <main>
                {user && (
                    <div className="container">
                        <div className="userinfo-container">
                            <Avatar
                                shape="circle"
                                src={photoURL}
                                icon={<UserOutlined />}
                                size={120}
                            />
                            <div className="usertext">
                                <h1 className="name">{displayName}</h1>
                                {totalBalance ? (
                                    <h2 className="total-balance">{`Total Balance: $${totalBalance}`}</h2>
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
                        <div className="section-title-row">
                            <h1 className="name">Portfolios</h1>
                            <PlusCircleOutlined
                                className="add-portfolio-button"
                                onClick={() => addPortfolio()}
                            />
                        </div>
                        <Divider className="divider" />
                        {portfolioData ? (
                            <div className="portfolios">
                                {portfolioData.portfolios.map(
                                    (portfolio, index) => {
                                        const {
                                            createdAt,
                                            name,
                                            balance,
                                            equity,
                                        } = portfolio
                                        const isDefault =
                                            portfolioData.defaultPortfolioIndex ===
                                            index

                                        return (
                                            <div
                                                className="portfolio-container"
                                                key={index}
                                            >
                                                <div>
                                                    <h1>
                                                        {name}{' '}
                                                        {isDefault ? (
                                                            <StarFilled
                                                                style={{
                                                                    fontSize:
                                                                        '30px',
                                                                    color:
                                                                        '#e9c46a',
                                                                }}
                                                                onClick={() => {}}
                                                            />
                                                        ) : (
                                                            <StarOutlined
                                                                style={{
                                                                    fontSize:
                                                                        '30px',
                                                                    color:
                                                                        'gray',
                                                                }}
                                                                onClick={() =>
                                                                    makeDefault(
                                                                        index,
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                    </h1>
                                                    <h2>
                                                        Total Value:{' '}
                                                        <span>
                                                            ${balance + equity}
                                                        </span>
                                                    </h2>
                                                    <h2>
                                                        Total Equity:{' '}
                                                        <span>${equity}</span>
                                                    </h2>
                                                    <h2>
                                                        Total Cash:{' '}
                                                        <span>${balance}</span>
                                                    </h2>
                                                </div>
                                                <div
                                                    className={cn(
                                                        'buttons-container',
                                                        'portfolio-buttons',
                                                    )}
                                                >
                                                    {!isDefault && (
                                                        <Button
                                                            type="primary"
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
                                                        >
                                                            Delete Portfolio
                                                        </Button>
                                                    )}
                                                    <Button
                                                        className={cn(
                                                            'primary-button',
                                                            'inject-money-button',
                                                        )}
                                                        type="primary"
                                                        onClick={() =>
                                                            injectMoney(
                                                                index,
                                                                10000,
                                                            )
                                                        }
                                                        loading={false}
                                                    >
                                                        + $10000
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    },
                                )}
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
                .profile {
                    min-height: calc(100vh - 3.75rem);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                main {
                    padding: 1.5rem 0;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    // justify-content: center;
                    align-items: center;
                }

                .container {
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

                .section-title-row {
                    display: flex;
                    align-items: center;
                    margin-top: 50px;
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
                    height: 53vh;
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
                    font-size: 35px;
                    margin-left: auto;
                }
                :global(.add-portfolio-button):hover {
                    color: #33ffaa;
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
                    main {
                        padding: 4rem 0;
                    }
                    .container {
                        width: 85%;
                    }
                    .userinfo-container,
                    .section-title-row,
                    .portfolio-container,
                    .portfolio-buttons {
                        flex-direction: column;
                    }
                    .userinfo-container,
                    .section-title-row {
                        align-items: center;
                    }

                    .portfolios {
                        height: unset;
                    }
                    :global(.primary-button),
                    .buttons-container,
                    .usertext,
                    h1 {
                        margin-left: 0;
                    }
                    :global(.add-portfolio-button) {
                        margin-left: 0;
                        margin-bottom: 20px;
                    }
                    :global(.inject-money-button) {
                        margin-top: 0.5em;
                    }
                    .skeleton-container {
                        display: none;
                    }
                }
            `}</style>
        </div>
    )
}

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

Profile.propTypes = {
    uid: PropTypes.string,
}

export default Profile
