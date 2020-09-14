/* globals window */
import { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import { firebaseClient } from '../utils/firebaseClient'

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
    //signInSuccessUrl: '/dashboard',
    credentialHelper: 'none',
    callbacks: {
        signInSuccessWithAuthResult: (authResult) => {
            // Create database entry for user if they're registering
            if (authResult.additionalUserInfo.isNewUser) {
                console.log('make db entry')
                const res = firebaseClient
                    .firestore()
                    .collection('users')
                    .doc(authResult.user.uid)
                    .set({
                        balance: 1000,
                    })
            }
            return true
        },
    },
}

const FirebaseAuth = () => {
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
                    <h2>Sign in to save your portfolios</h2>
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

                h1 {
                    font-size: 40px;
                    margin: 0;
                }
            `}</style>
        </div>
    )
}

export default FirebaseAuth
