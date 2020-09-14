import Head from 'next/head'

const Dashboard = () => {
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
