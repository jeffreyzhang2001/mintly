import { useUser } from '../utils/auth/useUser'

const Dashboard = () => {
    const { user } = useUser()

    return (
        <header>
            <h1>Dashboard</h1>
            {user && (
                <>
                    <p>Profile:</p>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </>
            )}
            <style jsx>{``}</style>
        </header>
    )
}

export default Dashboard
