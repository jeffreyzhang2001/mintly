import PropTypes from 'prop-types'
import { useState } from 'react'

import axios from 'axios'
import nookies from 'nookies'
import { firebaseAdmin } from '../utils/firebase/firebaseAdmin'
import { firebaseClient } from '../utils/firebase/firebaseClient'
import usePagination from 'firestore-pagination-hook'
import useAuth from '../utils/hooks/useAuth'

import { Button, AutoComplete } from 'antd'
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
    const firestoreData = items?.[0]?.data()
    const { totalBalance, totalEquity, portfolioData } = firestoreData || {}

    const [selectedTicker, setSelectedTicker] = useState()
    const [autoCompleteValue, setAutoCompleteValue] = useState('')
    const [autoCompleteData, setAutoCompleteData] = useState([])
    const handleSearch = (text) => {
        const renderLabel = (symbol, name) => {
            return {
                value: symbol,
                label: (
                    <div
                        style={{
                            display: 'flex',
                        }}
                    >
                        <span style={{ fontWeight: 600 }}>{symbol}</span>
                        <span style={{ marginLeft: 'auto' }}>{name}</span>
                    </div>
                ),
            }
        }

        const getTickerFromAPI = async (text) => {
            const res = await axios.get(`/api/search/${text}`)
            const stocks = res.data?.matches?.map((stock) =>
                renderLabel(stock.symbol, stock.name),
            )
            setAutoCompleteData(stocks)
        }

        if (text && text.match(/^[0-9a-zA-Z]+$/)) {
            setAutoCompleteValue(text)
            getTickerFromAPI(text)
        } else {
            setAutoCompleteValue(text)
            setAutoCompleteData([])
        }
    }

    return (
        <div className="dashboard">
            <main>
                <div className="container">
                    <AutoComplete
                        className="autocomplete"
                        placeholder="Search Ticker (e.g. AAPL)"
                        options={autoCompleteData}
                        value={autoCompleteValue}
                        onChange={(text) => handleSearch(text)}
                        onSelect={(value) => {
                            console.log(value, 'selected')
                            setSelectedTicker(value)
                            setAutoCompleteData([])
                        }}
                    />
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

                :global(.autocomplete) {
                    width: 100%;
                    background: #cfd7ff;
                    border: 1px solid #33ffaa;
                    box-shadow: 3px 4px 0px #008f53;
                }

                .portfolio-container {
                    display: flex;
                    justify-content: center;
                }
            `}</style>
        </div>
    )
}

Dashboard.propTypes = {
    uid: PropTypes.string,
}

export default Dashboard
