import Head from 'next/head'
import FirebaseAuth from '../components/FirebaseAuth'

const Login = () => (
    <div>
        <Head>
            <title>Mintly | Login</title>
        </Head>
        <div>
            <FirebaseAuth />
        </div>
    </div>
)

export default Login
