# [<img src="https://twemoji.maxcdn.com/v/13.0.1/72x72/1f343.png" alt="" width="50px" height="50px">](https://mintly.vercel.app/) Mintly - [mintly.vercel.app](https://mintly.vercel.app/)

Mintly is a free paper-trading platform with unlimited portfolios and an endless bankroll.  
Buy stocks, trade options, and best of all - inject money into your account whenever you want.  
Mintly is completely responsive, so feel free to trade on your phone!

## Technologies
Mintly is a serverless web app built with Next.js (React) and Firebase.  
Authentication is handled by Firebase and data is stored in Cloud Firestore.  
Since the application is built on Next.js, server-side rendering promises extremely fast page loads.
## Running Locally
To run the platform locally, clone the repo and run:

```
npm install
npm run dev
```

Make sure to populate a .env.local in the root directory with the following variables which you can find by generating a new Firebase project and Cloud Firestore database:
```
FIREBASE_CLIENT_EMAIL=
NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
```
