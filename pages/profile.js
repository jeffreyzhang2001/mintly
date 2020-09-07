import { useUser } from '../utils/auth/useUser'
import Twemoji from 'react-twemoji'

const Profile = () => {
    const { user, logout } = useUser()

    return (
        <header>
            <h1>Profile</h1>
            {user && (
                <>
                    <p>Profile:</p>
                    <pre>{JSON.stringify(user, null, 2)}</pre>
                </>
            )}
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
            <style jsx>{``}</style>
        </header>
    )
}

export default Profile
