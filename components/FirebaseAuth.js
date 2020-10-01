import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import { firebaseClient } from '../utils/firebase/firebaseClient'
import useAuth from '../utils/hooks/useAuth'

import CircleLoader from 'react-spinners/CircleLoader'

import BankrollSizeInput from '../components/BankrollSizeInput'

const FirebaseAuth = ({ isRegistering }) => {
    const { user } = useAuth()
    useEffect(() => {
        if (user) {
            router.push('/dashboard')
        }
    }, [user])

    const router = useRouter()

    const [bankrollSize, setBankrollSize] = useState(50000)

    const firebaseAuthConfig = {
        signInFlow: 'popup',
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            {
                provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                requireDisplayName: true,
            },
        ],
        credentialHelper: 'none',
        callbacks: {
            signInSuccessWithAuthResult: (authResult) => {
                setIsAuthenticated(true)
                // Create database entry for user if they're registering
                if (authResult.additionalUserInfo.isNewUser) {
                    const initialBalance =
                        bankrollSize === 0 ? 1000 : bankrollSize
                    const res = firebaseClient
                        .firestore()
                        .collection('users')
                        .doc(authResult.user.uid)
                        .set({
                            createdAt: firebase.firestore.Timestamp.fromDate(
                                new Date(),
                            ),
                            uid: authResult.user.uid,
                            portfolioData: {
                                defaultPortfolioIndex: 0,
                                portfolios: [
                                    {
                                        createdAt: firebaseClient.firestore.Timestamp.fromDate(
                                            new Date(),
                                        ),
                                        name: 'Portfolio 1',
                                        balance: initialBalance,
                                        equity: 0,
                                        equities: {},
                                        history: [
                                            {
                                                createdAt: firebaseClient.firestore.Timestamp.fromDate(
                                                    new Date(),
                                                ),
                                                action: 'deposit',
                                                assetType: 'cash',
                                                assetName: 'USD',
                                                amount: initialBalance,
                                            },
                                        ],
                                    },
                                ],
                            },
                        })
                        .then((res) => router.push('/dashboard'))
                }
                return false
            },
        },
    }

    // Render logic
    const [renderAuth, setRenderAuth] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setRenderAuth(true)
        }
    }, [])

    // Mechanism to re-render StyledFirebaseAuth on hover to force update uiConfig
    const [authContainerKey, setAuthContainerKey] = useState(0)

    return (
        <div>
            {renderAuth && !isAuthenticated ? (
                <div className="firebase-auth-container">
                    <h1>{isRegistering ? 'Register' : 'Log In'}</h1>
                    {isRegistering ? (
                        <h2>Sign up to start trading.</h2>
                    ) : (
                        <h2>Sign in to start trading.</h2>
                    )}
                    {isRegistering && (
                        <h2
                            onMouseLeave={() =>
                                setAuthContainerKey((prevKey) => prevKey + 1)
                            }
                        >
                            (If you&apos;re new, we&apos;ll mint
                            <div className="bankroll-form-container">
                                $
                                <BankrollSizeInput
                                    bankrollSize={bankrollSize}
                                    onChange={setBankrollSize}
                                />
                                for you)
                            </div>
                        </h2>
                    )}
                    {bankrollSize === 0 && (
                        <h3>
                            You can&apos;t trade with $0! We&apos;ll mint you
                            $1,000 instead.
                        </h3>
                    )}
                    <StyledFirebaseAuth
                        key={authContainerKey}
                        uiConfig={firebaseAuthConfig}
                        firebaseAuth={firebase.auth()}
                    />
                </div>
            ) : (
                <div>
                    <h1 className="firebase-auth-container">Logging In...</h1>
                    <CircleLoader
                        css={`
                            display: block;
                            padding-top: 300px;
                            margin: auto;
                        `}
                        size={150}
                        color={'white'}
                        loading={isAuthenticated}
                    />
                </div>
            )}

            <style jsx>{`
                .firebase-auth-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin-top: 150px;
                }

                :global(.firebaseui-idp-text),
                :global(.ant-input-affix-wrapper) {
                    font-family: -apple-system, BlinkMacSystemFont, Inter,
                        Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans,
                        Droid Sans, Helvetica Neue, sans-serif;
                }

                :global(.ant-input) {
                    font-size: 18px;
                    color: #008f53;
                }
                :global(.ant-row) {
                    margin-left: 4px;
                    margin-right: 10px;
                    width: 80px;
                }

                h1 {
                    font-size: 40px;
                    margin-bottom: 10px;
                    color: #33ffaa;
                }

                h2 {
                    font-size: 23px;
                    display: flex;
                    margin-bottom: 5px;
                }
                .bankroll-form-container {
                    margin-left: 5px;
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                }
                @media only screen and (max-width: 600px) {
                    h2 {
                        flex-direction: column;
                    }
                }

                h3 {
                    text-align: center;
                    margin-top: -15px;
                    color: pink;
                }
            `}</style>
        </div>
    )
}

FirebaseAuth.propTypes = {
    isRegistering: PropTypes.bool,
}

export default FirebaseAuth
