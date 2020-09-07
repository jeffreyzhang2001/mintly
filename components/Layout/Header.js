import Link from 'next/link'
import { useUser } from '../../utils/auth/useUser'
import Twemoji from 'react-twemoji'

const Header = () => {
    const { user, logout } = useUser()

    return (
        <header>
            {user ? (
                <>
                    <Link href="/profile">
                        <a>Profile</a>
                    </Link>
                    <Link href="">
                        <a onClick={() => logout()}>Logout</a>
                    </Link>
                </>
            ) : (
                <>
                    <a href="/login">Login</a>
                </>
            )}

            {/* <div className="container">
                <Twemoji>🍃</Twemoji>
            </div> */}
            <style jsx>{`
                header {
                    background-color: #121212;
                    position: fixed;
                    width: 100%;
                    height: 70px;
                    display: flex;
                    overflow: hidden;
                }

                header img {
                    margin-left: 0.5rem;
                }

                header a {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                }
            `}</style>
        </header>
    )
}

export default Header
