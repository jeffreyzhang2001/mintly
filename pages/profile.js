import Head from 'next/head'
import useAuth from '../utils/hooks/useAuth'

const Profile = () => {
    const { user, logout } = useAuth()

    return (
        <div>
            <Head>
                <title>Mintly | Profile</title>
            </Head>
            <h1>Profile</h1>
            {user && (
                <>
                    <p
                        style={{
                            display: 'inline-block',
                            color: 'blue',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        }}
                        onClick={() => logout()}
                    >
                        Log out
                    </p>
                    <p>Profile:</p>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </>
            )}
            <style jsx>{``}</style>
        </div>
    )
}

export default Profile
