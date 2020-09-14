import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'

if (typeof window !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp({
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    })
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
}

export { firebase as firebaseClient }
