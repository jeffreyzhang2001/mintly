import admin from 'firebase-admin'

try {
    admin.initializeApp({
        credential: admin.credential.cert({
            project_id: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            private_key: firebasePrivateKey.replace(/\\n/g, '\n'),
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    })
} catch (error) {
    // We skip the "already exists" message which is not an actual error when we're hot-reloading.
    if (!/already exists/u.test(error.message)) {
        console.error('Firebase admin initialization error', error.stack)
    }
}

export default admin.firestore()
