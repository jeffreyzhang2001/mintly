import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import nookies from 'nookies'
import { firebaseAdmin } from '../utils/firebase/firebaseAdmin'
import useFirestore from '../utils/hooks/useFirestore'

import { Button } from 'antd'
import Skeleton from 'react-loading-skeleton'
import SearchTicker from '../components/SearchTicker'

const Dashboard = ({ uid }) => {
    const {
        userInfo,
        addPortfolio,
        deletePortfolio,
        makeDefault,
        injectMoney,
    } = useFirestore(uid)
    const {
        createdAt,
        totalBalance,
        totalEquity,
        accountValue,
        portfolioData,
    } = userInfo || {}

    const [selectedTicker, setSelectedTicker] = useState()

    return (
        <div className="dashboard">
            <main>
                <div className="container">
                    <SearchTicker onSelect={setSelectedTicker} />
                    <div className="portfolio-container">
                        {totalBalance || <Skeleton />}
                    </div>
                </div>
            </main>
            <style jsx>{`
                .dashboard {
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
                    / justify-content: center;
                    align-items: center;
                }

                .container {
                    width: 55%;
                }

                .portfolio-container {
                    display: flex;
                    justify-content: center;
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

Dashboard.propTypes = {
    uid: PropTypes.string,
}

export default Dashboard
