import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import { firebaseClient } from '../utils/firebaseClient'
import useAuth from '../utils/hooks/useAuth'

const FirebaseAuth = () => {
    const { user } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (user) {
            router.push('/dashboard')
        }
    }, [user])
    const firebaseAuthConfig = {
        signInFlow: 'popup',
        // Auth providers
        // https://github.com/firebase/firebaseui-web#configure-oauth-providers
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
                // Create database entry for user if they're registering
                if (authResult.additionalUserInfo.isNewUser) {
                    const res = firebaseClient
                        .firestore()
                        .collection('users')
                        .doc(authResult.user.uid)
                        .set({
                            uid: authResult.user.uid,
                            balance: 1000,
                        })
                        .then((res) => router.push('/dashboard'))
                }
                return false
            },
        },
    }

    // Render logic
    const [renderAuth, setRenderAuth] = useState(false)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setRenderAuth(true)
        }
    }, [])

    return (
        <div>
            {renderAuth ? (
                <div className="firebase-auth-container">
                    <h1>Log In / Register</h1>
                    <h2>
                        Sign in to start trading (we&apos;ll mint ____ for you)
                    </h2>
                    <StyledFirebaseAuth
                        uiConfig={firebaseAuthConfig}
                        firebaseAuth={firebase.auth()}
                    />
                </div>
            ) : null}

            <style jsx>{`
                .firebase-auth-container {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin-top: 150px;
                }

                :global(.firebaseui-idp-text) {
                    font-family: -apple-system, BlinkMacSystemFont, Inter,
                        Roboto;
                }

                h1 {
                    font-size: 40px;
                    margin: 0;
                }
            `}</style>
        </div>
    )
}

export default FirebaseAuth
