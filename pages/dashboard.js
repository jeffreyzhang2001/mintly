import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import { isEmpty } from 'lodash'
import nookies from 'nookies'
import { firebaseAdmin } from '../utils/firebase/firebaseAdmin'
import useFirestore from '../utils/hooks/useFirestore'
import useSWR from 'swr'
import axios from 'axios'

import cn from 'classnames'
import { Button, Select, Modal, Divider } from 'antd'
const { Option } = Select
import {
    ExclamationCircleOutlined,
    PlusOutlined,
    StarOutlined,
    StarFilled,
} from '@ant-design/icons'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import SearchTicker from '../components/SearchStock'

const Dashboard = ({ uid }) => {
    const {
        isLoading,
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
    const { defaultPortfolioIndex, portfolios } = portfolioData || {}
    const portfolioOptions = portfolios?.map((portfolio, index) => (
        <Option value={index} key={index}>
            {portfolio.name}
        </Option>
    ))
    const [activePortfolioIndex, setActivePortfolioIndex] = useState(0)
    useEffect(() => {
        if (!isLoading) {
            setActivePortfolioIndex(defaultPortfolioIndex)
        }
    }, [isLoading])
    const isDefault = activePortfolioIndex === defaultPortfolioIndex

    // setSelectedStock is handled by <SearchStock /> component
    const [selectedStock, setSelectedStock] = useState({})
    const isStockSelected = !isEmpty(selectedStock)
    const { data: stockData, error } = useSWR(
        selectedStock?.ticker ? `/api/ticker/${selectedStock?.ticker}` : null,
        (url) => axios(url).then((response) => response.data),
    )
    const { priceData, recommendationTrends, companyNews } = stockData || {}

    // portfolio, trade, history
    const [activeView, setActiveView] = useState('portfolio')

    return (
        <div className="dashboard">
            <main>
                {!isLoading && (
                    <div className="container">
                        <div className="portfolio-header">
                            <div className="usertext">
                                <Select
                                    size={'large'}
                                    bordered={false}
                                    style={{
                                        color: 'white',
                                        marginLeft: '-3%',
                                    }}
                                    defaultValue={activePortfolioIndex}
                                    value={activePortfolioIndex}
                                    onChange={(value) =>
                                        setActivePortfolioIndex(value)
                                    }
                                >
                                    {portfolioOptions}
                                </Select>
                                {isDefault ? (
                                    <StarFilled
                                        style={{
                                            marginLeft: '15px',
                                            fontSize: '35px',
                                            color: '#e9c46a',
                                        }}
                                        onClick={() => {}}
                                    />
                                ) : (
                                    <StarOutlined
                                        style={{
                                            marginLeft: '15px',
                                            fontSize: '35px',
                                            color: 'gray',
                                        }}
                                        onClick={() =>
                                            makeDefault(activePortfolioIndex)
                                        }
                                    />
                                )}
                                <h1 className="account-balance">
                                    $
                                    {portfolios[activePortfolioIndex]?.equity +
                                        portfolios[activePortfolioIndex]
                                            ?.balance}
                                    <span className="subtitle-balance">
                                        Equity: $
                                        {
                                            portfolios[activePortfolioIndex]
                                                ?.equity
                                        }{' '}
                                        | Cash: $
                                        {
                                            portfolios[activePortfolioIndex]
                                                ?.balance
                                        }
                                    </span>
                                </h1>
                            </div>
                            <div className="buttons-container">
                                {!isDefault && (
                                    <Button
                                        className="destructive-button"
                                        onClick={() => {
                                            Modal.confirm({
                                                title: 'Delete Portfolio',
                                                icon: (
                                                    <ExclamationCircleOutlined />
                                                ),
                                                content: `Are you sure you want to delete this portfolio?`,
                                                centered: true,
                                                maskClosable: true,
                                                okText: 'Delete',
                                                okButtonProps: {
                                                    className:
                                                        'destructive-button',
                                                },
                                                onOk: () => {
                                                    deletePortfolio(
                                                        activePortfolioIndex,
                                                    )
                                                    setActivePortfolioIndex(
                                                        defaultPortfolioIndex,
                                                    )
                                                },
                                                cancelText: 'Cancel',
                                                cancelButtonProps: {
                                                    className:
                                                        'modal-cancel-button',
                                                    type: 'primary',
                                                },
                                            })
                                        }}
                                        type="primary"
                                    >
                                        Delete
                                    </Button>
                                )}
                                <Button
                                    className={cn(
                                        'primary-button',
                                        'inject-money-button',
                                    )}
                                    type="primary"
                                    onClick={() =>
                                        injectMoney(activePortfolioIndex, 10000)
                                    }
                                >
                                    + $10000
                                </Button>
                            </div>
                        </div>
                        <div className="section-title-row">
                            <a
                                className="tab"
                                onClick={() => setActiveView('portfolio')}
                            >
                                <h1
                                    className={cn('tab', {
                                        activeTab: activeView === 'portfolio',
                                    })}
                                >
                                    Portfolio
                                </h1>
                            </a>
                            <a
                                className="tab"
                                onClick={() => setActiveView('trade')}
                            >
                                <h1
                                    className={cn('tab', {
                                        activeTab: activeView === 'trade',
                                    })}
                                >
                                    Trade
                                </h1>
                            </a>
                            <a
                                className="tab"
                                onClick={() => setActiveView('history')}
                            >
                                <h1
                                    className={cn('tab', {
                                        activeTab: activeView === 'history',
                                    })}
                                >
                                    History
                                </h1>
                            </a>
                        </div>
                        <Divider className="divider" />
                        <div className="views-container">
                            {activeView === 'portfolio' ? (
                                <div>
                                    <div className="stock-info-background">
                                        <div className="inner-card-container">
                                            <h1 className="stock-ticker">
                                                You don&apos;t have any stocks
                                                yet.
                                            </h1>
                                            <h2 className="">
                                                Buy some in the Trade tab!
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            ) : activeView === 'trade' ? (
                                <div className="view-container">
                                    <SearchTicker
                                        autoCompleteClassName="ticker-autocomplete"
                                        onSelect={setSelectedStock}
                                    />
                                    <SkeletonTheme
                                        color="#afbfd4"
                                        highlightColor={
                                            stockData ? '#d8e0e9' : '#afbfd4'
                                        }
                                    >
                                        <div className="stock-info-background">
                                            <div
                                                className={cn(
                                                    'inner-card-container',
                                                    'stock-card-container',
                                                )}
                                            >
                                                <div style={{ width: '50%' }}>
                                                    <h1 className="stock-ticker">
                                                        {selectedStock?.ticker ||
                                                            'Select a stock'}
                                                        {priceData ? (
                                                            <>
                                                                <span className="stock-price">
                                                                    {
                                                                        priceData.current
                                                                    }{' '}
                                                                </span>
                                                                <span className="percent-change">
                                                                    (
                                                                    {
                                                                        priceData.percentChange
                                                                    }
                                                                    %)
                                                                </span>
                                                            </>
                                                        ) : isStockSelected ? (
                                                            <span className="stock-price">
                                                                <Skeleton
                                                                    width={75}
                                                                />
                                                            </span>
                                                        ) : null}
                                                    </h1>
                                                    <h2>
                                                        {selectedStock?.name || (
                                                            <Skeleton
                                                                count={3}
                                                            />
                                                        )}
                                                    </h2>
                                                </div>
                                                {isStockSelected && (
                                                    <div className="card-right-container">
                                                        <Button
                                                            className="destructive-button"
                                                            onClick={() => {}}
                                                            type="primary"
                                                        >
                                                            Sell
                                                        </Button>
                                                        <Button
                                                            className={cn(
                                                                'primary-button',
                                                                'inject-money-button',
                                                            )}
                                                            type="primary"
                                                            onClick={() => {}}
                                                        >
                                                            Buy
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {isStockSelected && companyNews && (
                                            <div className="stock-info-background">
                                                <div className="inner-card-container">
                                                    <h1 className="stock-ticker">
                                                        News
                                                    </h1>
                                                    {companyNews
                                                        ?.slice(0, 3)
                                                        ?.map(
                                                            (
                                                                article,
                                                                index,
                                                            ) => (
                                                                <a
                                                                    key={index}
                                                                    href={
                                                                        article.url
                                                                    }
                                                                >
                                                                    <h2 className="headline">
                                                                        {
                                                                            article.headline
                                                                        }
                                                                    </h2>
                                                                </a>
                                                            ),
                                                        )}
                                                </div>
                                            </div>
                                        )}
                                    </SkeletonTheme>
                                </div>
                            ) : (
                                <h2>History is coming soon!</h2>
                            )}
                        </div>
                    </div>
                )}
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
                    padding: 2rem 0;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    / justify-content: center;
                    align-items: center;
                }

                .container {
                    width: 55%;
                }
                .portfolio-header {
                    display: flex;
                }

                :global(.ant-select-selection-item) {
                    font-size: 45px;
                    font-weight: 600;
                }
                :global(.ant-select-arrow) {
                    color: white;
                    font-size: 30px;
                }
                .account-balance {
                    font-size: 30px;
                }
                .subtitle-balance {
                    margin-left: 10px;
                    color: gray;
                    font-size: 25px;
                }
                .buttons-container {
                    display: flex;
                    margin-left: auto;
                }

                .section-title-row {
                    display: flex;
                    align-items: center;
                    margin-top: 20px;
                    margin-right: auto;
                }
                .tab:not(:first-of-type) {
                    margin-left: 12px;
                }
                .activeTab,
                .tab:hover {
                    color: gray;
                }

                .view-container {
                    height: 60vh;
                }
                :global(.ticker-autocomplete) {
                    margin-top: 2px;
                }
                .stock-info-background {
                    margin-top: 20px;
                    height: 25%;
                    border-radius: 15px;
                    /background-color: #88a1bf;
                    background-image: linear-gradient(to left top, #6F9B8A , #88a1bf);
                    color: black;
                }
                .inner-card-container {
                    padding: 10px 20px;
                }
                .stock-card-container {
                    display: flex;
                }
                .card-right-container {
                    margin-left: auto;
                    display: flex;
                    align-items: center;
                }
                .stock-ticker {
                    font-size: 30px;
                    font-weight: 700;
                }
                .stock-price,
                .percent-change {
                    font-weight: 400;
                }
                .stock-price {
                    margin-left: 15px;
                    color: #E5E1E6;
                }
                .percent-change {
                    font-size: 25px;
                    color: ${
                        priceData?.current > priceData?.prevClose
                            ? 'palegreen'
                            : 'indianred'
                    };
                }
                .headline {
                    font-weight: 500;
                }

                :global(.divider) {
                    margin-top: 0;
                    margin-bottom: 10px;
                    color: white;
                    border-color: white;
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

                @media only screen and (max-width: 600px) {
                    main {
                        padding: 4rem 0;
                    }
                    .container {
                        width: 85%;
                    }
                    .portfolio-header,
                    .portfolio-buttons {
                        flex-direction: column;
                    }
                    .portfolio-header {
                        align-items: center;
                    }

                    .view-container {
                        height: unset;
                    }

                    .buttons-container,
                    .usertext,
                    h1 {
                        font-size: 30px;
                        margin-left: 0;
                    }
                    :global(.add-portfolio-button) {
                        margin-left: 0;
                        margin-bottom: 20px;
                    }
                    :global(.inject-money-button) {
                        margin-top: 0;
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

Dashboard.propTypes = {
    uid: PropTypes.string,
}

export default Dashboard
