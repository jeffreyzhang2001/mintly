# Mintly
**Mintly** is a serverless paper-trading platform built with Next.js and Firebase. Authentication is handled by Firebase, and data is stored in Cloud Firestore.  
The web app takes advantage of server-side rendering to deliver extremely fast page loads.

# Running Locally
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
