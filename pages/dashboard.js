import Head from 'next/head'
import { useUser } from '../utils/auth/useUser'

const Dashboard = () => {
    const { user } = useUser()

    return (
        <div>
            <Head>
                <title>Mintly | Dashboard</title>
            </Head>
            <h1>Dashboard</h1>
            {/* {user && (
                <>
                    <p>Profile:</p>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </>
            )} */}
            <style jsx>{``}</style>
        </div>
    )
}

export default Dashboard
