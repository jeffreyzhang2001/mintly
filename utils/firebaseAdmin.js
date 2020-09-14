import * as firebaseAdmin from 'firebase-admin'

if (!firebaseAdmin.apps.length) {
    firebaseAdmin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            // https://stackoverflow.com/a/41044630/1332513
            privateKey: firebasePrivateKey.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    })
}

export { firebaseAdmin }
