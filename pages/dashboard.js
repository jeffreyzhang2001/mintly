import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'

import nookies from 'nookies'
import { firebaseAdmin } from '../utils/firebase/firebaseAdmin'
import useFirestore from '../utils/hooks/useFirestore'

import cn from 'classnames'
import { Button, Select, Modal, Divider } from 'antd'
const { Option } = Select
import {
    ExclamationCircleOutlined,
    PlusOutlined,
    StarOutlined,
    StarFilled,
} from '@ant-design/icons'
import Skeleton from 'react-loading-skeleton'
import SearchTicker from '../components/SearchTicker'

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

    // portfolio, history
    const [activeView, setActiveView] = useState('portfolio')
    const [selectedTicker, setSelectedTicker] = useState()

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
                                    loading={false}
                                >
                                    + $10000
                                </Button>
                            </div>
                        </div>
                        <SearchTicker
                            className="ticker-autocomplete"
                            onSelect={setSelectedTicker}
                        />
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

                :global(.ticker-autocomplete) {
                    margin-top: 10px;
                }
                
                .section-title-row {
                    display: flex;
                    align-items: center;
                    margin-top: 50px;
                    margin-right: auto;
                }
                .tab:not(:first-of-type) {
                    margin-left: 10px;
                }
                .activeTab,
                .tab:hover {
                    color: gray;
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
                h2 {
                    color: #c7c3bd;
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
                        margin-top: 0;
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

Dashboard.propTypes = {
    uid: PropTypes.string,
}

export default Dashboard
