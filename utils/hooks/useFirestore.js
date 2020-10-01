import { useState, useEffect } from 'react'
import { firebaseClient } from '../firebase/firebaseClient'
import usePagination from 'firestore-pagination-hook'

const useFirestore = (uid) => {
    const db = firebaseClient.apps.length && firebaseClient.firestore()
    const {
        loading: isLoading,
        loadingError,
        loadingMore,
        loadingMoreError,
        hasMore,
        items,
        loadMore,
    } = usePagination(db && db.collection('users').where('uid', '==', uid))
    const firestoreData = items?.[0]?.data()
    const { createdAt, portfolioData } = firestoreData || {}

    const [totalBalance, setTotalBalance] = useState()
    const [totalEquity, setTotalEquity] = useState()
    const [accountValue, setAccountValue] = useState()
    useEffect(() => {
        if (portfolioData) {
            setTotalBalance(
                portfolioData.portfolios.reduce(
                    (sum, portfolio) => sum + portfolio.balance,
                    0,
                ),
            )
            setTotalEquity(
                portfolioData.portfolios.reduce(
                    (sum, portfolio) => sum + portfolio.equity,
                    0,
                ),
            )
        }
    }, [portfolioData])
    useEffect(() => {
        setAccountValue(totalBalance + totalEquity)
    }, [totalBalance, totalEquity])

    const userInfo = {
        createdAt,
        totalBalance,
        totalEquity,
        accountValue,
        portfolioData,
    }

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
                                history: [],
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
                        defaultPortfolioIndex:
                            portfolioData.defaultPortfolioIndex > toDeleteIndex
                                ? portfolioData.defaultPortfolioIndex - 1
                                : portfolioData.defaultPortfolioIndex,
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
            history: [
                ...currentPortfolios[index].history,
                {
                    createdAt: firebaseClient.firestore.Timestamp.fromDate(
                        new Date(),
                    ), // Required
                    action: 'deposit', // Required: 'deposit' | 'buy' | 'sell' | 'other'
                    assetType: 'cash', // Required: 'cash' | 'stock' | 'option' | 'other'
                    assetName: 'USD', // Required
                    amount, // Optional
                },
            ],
        }

        const res = firebaseClient
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
                {
                    portfolioData: {
                        portfolios: currentPortfolios,
                    },
                },
                { merge: true },
            )
    }

    const purchaseAsset = (
        index,
        assetType,
        assetName,
        assetPrice,
        quantity,
    ) => {
        let currentPortfolios = [...portfolioData.portfolios]
        currentPortfolios[index] = {
            ...currentPortfolios[index],
            balance: currentPortfolios[index].balance - assetPrice * quantity,
            equity: currentPortfolios[index].equity + assetPrice * quantity,
            equities: {
                ...currentPortfolios[index].equities,
                [assetName]: {
                    quantityShares:
                        (currentPortfolios[index].equities?.[assetName]
                            ?.shares || 0) + quantity,
                },
            },
            history: [
                ...currentPortfolios[index].history,
                {
                    createdAt: firebaseClient.firestore.Timestamp.fromDate(
                        new Date(),
                    ), // Required
                    action: 'buy', // Required
                    assetType, // Required
                    assetName, // Required
                    assetPrice, // Required
                    quantity, // Required
                },
            ],
        }

        const res = firebaseClient
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
                {
                    portfolioData: {
                        portfolios: currentPortfolios,
                    },
                },
                { merge: true },
            )
    }

    const sellAsset = (index, assetType, assetName, assetPrice, quantity) => {
        let currentPortfolios = [...portfolioData.portfolios]
        currentPortfolios[index] = {
            ...currentPortfolios[index],
            balance: currentPortfolios[index].balance + assetPrice * quantity,
            equity: currentPortfolios[index].equity - assetPrice * quantity,
            equities: {
                ...currentPortfolios[index].equities,
                [assetName]: {
                    quantityShares:
                        (currentPortfolios[index].equities?.[assetName]
                            ?.shares || 0) - quantity,
                },
            },
            history: [
                ...currentPortfolios[index].history,
                {
                    createdAt: firebaseClient.firestore.Timestamp.fromDate(
                        new Date(),
                    ), // Required
                    action: 'sell', // Required
                    assetType, // Required
                    assetName, // Required
                    assetPrice, // Required
                    quantity, // Required
                },
            ],
        }

        const res = firebaseClient
            .firestore()
            .collection('users')
            .doc(uid)
            .set(
                {
                    portfolioData: {
                        portfolios: currentPortfolios,
                    },
                },
                { merge: true },
            )
    }

    return {
        isLoading,
        userInfo,
        addPortfolio,
        deletePortfolio,
        makeDefault,
        injectMoney,
        purchaseAsset,
        sellAsset,
    }
}

export default useFirestore
