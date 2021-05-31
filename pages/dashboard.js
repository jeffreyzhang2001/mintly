import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import { isEmpty } from 'lodash'
import nookies from 'nookies'
import { firebaseAdmin } from '../utils/firebase/firebaseAdmin'
import useFirestore from '../utils/hooks/useFirestore'
import useSWR from 'swr'
import axios from 'axios'
import { secondsToDate } from '../utils/utils'

import cn from 'classnames'
import { Button, Select, Modal, Form, Input, notification, Divider } from 'antd'
const { Option } = Select
import {
    ExclamationCircleOutlined,
    StarOutlined,
    StarFilled,
} from '@ant-design/icons'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import SearchStock from '../components/SearchStock'

const Dashboard = ({ uid }) => {
    const {
        isLoading,
        userInfo,
        addPortfolio,
        deletePortfolio,
        makeDefault,
        injectMoney,
        purchaseAsset,
        sellAsset,
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

    // Fetch selectedStock data from /api/ticker
    const { data: stockData, error } = useSWR(
        selectedStock?.ticker ? `/api/ticker/${selectedStock?.ticker}` : null,
        (url) => axios(url).then((response) => response.data),
    )
    const { priceData, recommendationTrends, companyNews } = stockData || {}

    // For buy/sell field in trade tab
    const [selectedStockQuantity, setSelectedStockQuantity] = useState(0)
    const handleBuy = () => {
        if (selectedStockQuantity === 0) {
            notification.info({
                message: `Error`,
                description: 'You must enter a number of shares to buy!',
                icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
                placement: 'bottomRight',
            })
        } else if (
            priceData.current * selectedStockQuantity >
            portfolios[activePortfolioIndex].balance
        ) {
            notification.info({
                message: `Error`,
                description:
                    "You don't have enough money to complete the order!",
                icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
                placement: 'bottomRight',
            })
        } else {
            Modal.confirm({
                title: 'Buy Stock',
                icon: (
                    <ExclamationCircleOutlined
                        style={{
                            color: 'green',
                        }}
                    />
                ),
                content: `Are you sure you want to buy ${selectedStockQuantity} shares of ${selectedStock.ticker}?`,
                centered: true,
                maskClosable: true,
                okText: 'Confirm',
                okButtonProps: {
                    className: 'primary-button',
                },
                onOk: () => {
                    purchaseAsset(
                        activePortfolioIndex,
                        'stock',
                        selectedStock.ticker,
                        priceData.current,
                        selectedStockQuantity,
                    )
                },
                cancelText: 'Cancel',
                cancelButtonProps: {
                    className: 'modal-cancel-button',
                    type: 'primary',
                },
            })
        }
    }
    const handleSell = () => {
        if (selectedStockQuantity === 0) {
            notification.info({
                message: `Error`,
                description: 'You must enter a number of shares to sell!',
                icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
                placement: 'bottomRight',
            })
        } else if (
            !portfolios[activePortfolioIndex]?.equities?.[
                selectedStock.ticker
            ] ||
            portfolios[activePortfolioIndex]?.equities?.[selectedStock.ticker]
                .quantityShares < selectedStockQuantity
        ) {
            notification.info({
                message: `Error`,
                description:
                    "You don't have enough shares to complete the order!",
                icon: <ExclamationCircleOutlined style={{ color: 'red' }} />,
                placement: 'bottomRight',
            })
        } else {
            Modal.confirm({
                title: 'Buy Stock',
                icon: (
                    <ExclamationCircleOutlined
                        style={{
                            color: 'red',
                        }}
                    />
                ),
                content: `Are you sure you want to sell ${selectedStockQuantity} shares of ${selectedStock.ticker}?`,
                centered: true,
                maskClosable: true,
                okText: 'Confirm',
                okButtonProps: {
                    className: 'destructive-button',
                },
                onOk: () => {
                    sellAsset(
                        activePortfolioIndex,
                        'stock',
                        selectedStock.ticker,
                        priceData.current,
                        selectedStockQuantity,
                    )
                },
                cancelText: 'Cancel',
                cancelButtonProps: {
                    className: 'modal-cancel-button',
                    type: 'primary',
                },
            })
        }
    }

    // Owned equities map
    const activePortfolioEquitiesString =
        portfolios?.[activePortfolioIndex]?.equities &&
        Object.keys(portfolios?.[activePortfolioIndex]?.equities)
            .map((item) => item)
            .join()
    const { data } = useSWR(
        activePortfolioEquitiesString
            ? `/api/quote/${activePortfolioEquitiesString}`
            : null,
        (url) => axios(url).then((response) => response.data),
    )
    const { portfolioEquitiesPriceData } = data || {}
    const activePortfolioEquities =
        portfolios?.[activePortfolioIndex]?.equities &&
        Object.keys(portfolios?.[activePortfolioIndex]?.equities).map(
            (item, index) => {
                const { quantityShares } = portfolios?.[
                    activePortfolioIndex
                ]?.equities?.[item]

                return {
                    assetName: item,
                    quantityShares,
                    ...portfolioEquitiesPriceData?.[item],
                }
            },
        )

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
                                    {(
                                        portfolios[activePortfolioIndex]
                                            ?.equity +
                                        portfolios[activePortfolioIndex]
                                            ?.balance
                                    ).toFixed(2)}
                                    <span className="subtitle-balance">
                                        Equity: $
                                        {portfolios[
                                            activePortfolioIndex
                                        ]?.equity.toFixed(2)}{' '}
                                        | Cash: $
                                        {portfolios[
                                            activePortfolioIndex
                                        ]?.balance.toFixed(2)}
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
                        {/* <Divider className="divider" /> */}
                        <div className="views-container">
                            {activeView === 'portfolio' ? (
                                isEmpty(activePortfolioEquities) ? (
                                    <div>
                                        <div
                                            className={cn(
                                                'outer-card-container',
                                                'portfolio-card-background',
                                            )}
                                        >
                                            <div className="inner-card-container">
                                                <h1 className="stock-ticker">
                                                    You don&apos;t have any
                                                    stocks yet.
                                                </h1>
                                                <h2 className="">
                                                    Visit the Trade tab!
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <SkeletonTheme
                                        color="#e2e2e2"
                                        highlightColor="#8e9eab"
                                    >
                                        <div className="view-container">
                                            {activePortfolioEquities.map(
                                                (equity, index) => (
                                                    <div
                                                        className={cn(
                                                            'outer-card-container',
                                                            'portfolio-card-background',
                                                        )}
                                                        key={index}
                                                    >
                                                        <div
                                                            className={cn(
                                                                'inner-card-container',
                                                                'stock-card-container',
                                                            )}
                                                        >
                                                            <div>
                                                                <h1 className="stock-ticker">
                                                                    {
                                                                        equity.assetName
                                                                    }
                                                                    <span className="stock-price">
                                                                        {equity.current || (
                                                                            <Skeleton
                                                                                width={
                                                                                    75
                                                                                }
                                                                                length={
                                                                                    50
                                                                                }
                                                                            />
                                                                        )}{' '}
                                                                    </span>
                                                                    <span
                                                                        className={cn(
                                                                            'percent-change',
                                                                            equity.current >
                                                                                equity.prevClose
                                                                                ? 'positive-change'
                                                                                : 'negative-change',
                                                                        )}
                                                                    >
                                                                        (
                                                                        {
                                                                            equity.percentChange
                                                                        }
                                                                        %)
                                                                    </span>
                                                                </h1>
                                                                <h2>
                                                                    {
                                                                        equity.quantityShares
                                                                    }{' '}
                                                                    {equity.quantityShares >
                                                                    1
                                                                        ? 'shares'
                                                                        : 'share'}
                                                                </h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </SkeletonTheme>
                                )
                            ) : activeView === 'trade' ? (
                                <div className="view-container">
                                    <SearchStock
                                        autoCompleteClassName="ticker-autocomplete"
                                        inputClassName="searchstock-input"
                                        onSelect={setSelectedStock}
                                    />
                                    <SkeletonTheme
                                        color="#e2e2e2"
                                        highlightColor={
                                            stockData ? '#8e9eab' : '#e2e2e2'
                                        }
                                    >
                                        <div
                                            className={cn(
                                                'outer-card-container',
                                                priceData?.current >
                                                    priceData?.prevClose
                                                    ? 'green-card-background'
                                                    : 'red-card-background',
                                                (!isStockSelected ||
                                                    !priceData) &&
                                                    'neutral-card-background',
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'inner-card-container',
                                                    'stock-card-container',
                                                )}
                                            >
                                                <div>
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
                                                                <span
                                                                    className={cn(
                                                                        'percent-change',
                                                                        priceData.current >
                                                                            priceData.prevClose
                                                                            ? 'positive-change'
                                                                            : 'negative-change',
                                                                    )}
                                                                >
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
                                                                    length={50}
                                                                />
                                                            </span>
                                                        ) : null}
                                                    </h1>
                                                    <h2>
                                                        {selectedStock?.name || (
                                                            <Skeleton
                                                                height={5}
                                                            />
                                                        )}
                                                    </h2>
                                                </div>
                                                {isStockSelected && (
                                                    <div className="card-right-container">
                                                        <Form.Item>
                                                            <Input
                                                                value={
                                                                    selectedStockQuantity
                                                                }
                                                                maxLength="4"
                                                                bordered="false"
                                                                onChange={(
                                                                    e,
                                                                ) => {
                                                                    const newValue = parseInt(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                    if (
                                                                        Number.isNaN(
                                                                            newValue,
                                                                        )
                                                                    ) {
                                                                        setSelectedStockQuantity(
                                                                            0,
                                                                        )
                                                                        return
                                                                    } else if (
                                                                        newValue <
                                                                        0
                                                                    ) {
                                                                        return
                                                                    }
                                                                    setSelectedStockQuantity(
                                                                        Number(
                                                                            newValue,
                                                                        ),
                                                                    )
                                                                }}
                                                            />
                                                        </Form.Item>
                                                        <Button
                                                            className="destructive-button"
                                                            onClick={handleSell}
                                                            type="primary"
                                                        >
                                                            Sell
                                                        </Button>
                                                        <Button
                                                            className={cn(
                                                                'primary-button',
                                                                'buy-button',
                                                            )}
                                                            type="primary"
                                                            onClick={handleBuy}
                                                        >
                                                            Buy
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {isStockSelected && companyNews && (
                                            <div
                                                className={cn(
                                                    'outer-card-container',
                                                    'neutral-card-background',
                                                )}
                                            >
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
                                                                    target="_blank"
                                                                    rel="noreferrer"
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
                                <div className="view-container">
                                    {portfolios[activePortfolioIndex]?.history
                                        .reverse()
                                        .map((event, index) => {
                                            if (event.action === 'deposit') {
                                                return (
                                                    <div
                                                        className={cn(
                                                            'outer-card-container',
                                                            'neutral-card-background',
                                                        )}
                                                    >
                                                        <div className="inner-card-container">
                                                            <h1 className="stock-ticker">
                                                                Deposited $
                                                                {event.amount}
                                                            </h1>
                                                            <h2>
                                                                {secondsToDate(
                                                                    event
                                                                        .createdAt
                                                                        .seconds,
                                                                )}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                )
                                            } else if (event.action === 'buy') {
                                                return (
                                                    <div
                                                        className={cn(
                                                            'outer-card-container',
                                                            'green-card-background',
                                                        )}
                                                    >
                                                        <div className="inner-card-container">
                                                            <h1 className="stock-ticker">
                                                                Bought{' '}
                                                                {event.quantity}{' '}
                                                                {event.quantity >
                                                                1
                                                                    ? 'shares'
                                                                    : 'share'}{' '}
                                                                of{' '}
                                                                <b>
                                                                    {
                                                                        event.assetName
                                                                    }
                                                                </b>{' '}
                                                                at{' '}
                                                                {
                                                                    event.assetPrice
                                                                }
                                                                /share
                                                            </h1>
                                                            <h2>
                                                                {secondsToDate(
                                                                    event
                                                                        .createdAt
                                                                        .seconds,
                                                                )}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                )
                                            } else if (
                                                event.action === 'sell'
                                            ) {
                                                return (
                                                    <div
                                                        className={cn(
                                                            'outer-card-container',
                                                            'red-card-background',
                                                        )}
                                                    >
                                                        <div className="inner-card-container">
                                                            <h1 className="stock-ticker">
                                                                Sold{' '}
                                                                {event.quantity}{' '}
                                                                {event.quantity >
                                                                1
                                                                    ? 'shares'
                                                                    : 'share'}{' '}
                                                                of{' '}
                                                                {
                                                                    event.assetName
                                                                }{' '}
                                                                at{' '}
                                                                {
                                                                    event.assetPrice
                                                                }
                                                                /share
                                                            </h1>
                                                            <h2>
                                                                {secondsToDate(
                                                                    event
                                                                        .createdAt
                                                                        .seconds,
                                                                )}
                                                            </h2>
                                                        </div>
                                                    </div>
                                                )
                                            } else {
                                                return <p>{event.action}</p>
                                            }
                                        })}
                                </div>
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
                .tab{
                    color: gray;
                }
                .tab:not(:first-of-type) {
                    margin-left: 12px;
                }
                .activeTab,
                .tab:hover {
                    color: white;
                }
                .activeTab {
                    border-style: solid;
                    border-width: 0 0 4px 0;
                    width:fit-content;
                    border-image: linear-gradient(0.25turn, #70e1f5, #ffd194) 1;
                }

                .view-container {
                    margin-top: 5px;
                    height: 55vh;
                    overflow: auto;
                }

                .view-container::-webkit-scrollbar {
                    background: white;
                    width: 0.4em;
                    border-radius: 15px;
                }
                .view-container::-webkit-scrollbar-thumb {
                    background-color: gray;
                    border-radius: 15px;
                }

                :global(.ticker-autocomplete) {
                    margin-top: 10px;
                }
                .portfolio-card-background {
                    background-image: linear-gradient(-225deg, #473B7B 0%, #3584A7 51%, #30D2BE 100%);
                }
                .green-card-background {
                    background: #11998e;
                    background: -webkit-linear-gradient(to left, #38ef7d, #11998e);
                    background: linear-gradient(to left, #38ef7d, #11998e);
                }
                .red-card-background {
                    background-image: linear-gradient(290deg, #F05F57 10%, #360940 100%);
                }
                .neutral-card-background {
                    background: #536976;
                    background: -webkit-linear-gradient(to right, #292E49, #536976);
                    background: linear-gradient(to right, #292E49, #536976);
                }
                .outer-card-container {
                    margin-top: 20px;
                    height: 18%;
                    width: 98%;
                    border-radius: 15px;
                }
                .inner-card-container {
                    padding: 8px 20px;
                }
                .stock-card-container {
                    display: flex;
                }
                .card-right-container {
                    margin-left: auto;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .stock-ticker {
                    font-size: 2.1em;
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
                    font-size: 0.8em;
                }
                .positive-change {
                    color: palegreen;
                }
                .negative-change {
                    color: pink;
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

                :global(.primary-button) {
                    margin-left: 12px;
                }
                :global(.destructive-button) {
                    background-color: #ff7e67 !important;
                }
                :global(.primary-button):hover,
                :global(.destructive-button):hover {
                    border-color: black !important;
                }
                :global(.destructive-button):hover {
                    background-color: #931a25 !important;
                }
                :global(.primary-button, .destructive-button, .modal-cancel-button) {
                    height: 40px;
                    border-radius: 8px;
                    border: solid 1px black !important;
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
                :global(.ant-input) {
                    font-size: 18px;
                }
                :global(.ant-row) {
                    margin-top: 10%;
                    margin-right: 10px;
                    width: 70px;
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
                        overflow: unset;
                    }
                    .card-right-container {
                        flex-direction: column;
                    }
                    :global(.buy-button) {
                        margin-left: 0;
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
