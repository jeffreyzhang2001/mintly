import { useRouter } from 'next/router'
import Link from 'next/link'
import useAuth from '../../utils/hooks/useAuth'

import { Button } from 'antd'
import Twemoji from 'react-twemoji'

const Header = () => {
    const { user } = useAuth()

    // Use router to check which page user is on and display it's name in header
    const router = useRouter()
    const pathname = router.pathname
    const currentPage =
        pathname === '/profile'
            ? 'Profile'
            : pathname === '/dashboard'
            ? 'Dashboard'
            : null

    return (
        <div>
            <header>
                <div className="header-container">
                    <Link href="/">
                        <a>
                            <Twemoji options={{ className: 'emoji' }}>🍃</Twemoji>
                        </a>
                    </Link>
                    <div className="currentpage-text-container">
                        <h1 className="slash">/</h1>
                        <h1 className="currentpage">{currentPage}</h1>
                    </div>
                    {user ? (
                        <>
                            <Link href="/profile">
                                <h2 className="loginBtn">Profile</h2>
                            </Link>
                            <Link href="/dashboard">
                                <Button type="primary" shape="round" size="large">
                                    Dashboard
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link href={'/login'}>
                                <h2 className="loginBtn">Log In</h2>
                            </Link>
                            <Link href={'/register'}>
                                <Button type="primary" shape="round" size="middle">
                                    Sign Up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </header>
            <style jsx>{`
                header {
                    display: flex;
                    justify-content: center;
                    padding: 0 15px 0 15px;
                    background-color: #121212;
                    position: absolute;
                    top: 0;
                    width: 100%;
                    height: 70px;
                    overflow: hidden;
                }

                .header-container {
                    display: flex;
                    align-items: center;
                    width: 70%;
                    height: 100%;
                }

                @media only screen and (max-width: 600px) {
                    .header-container {
                        width: 100%;
                    }
                }

                :global(.emoji) {
                    height: 50px;
                    width: 50px;
                    transition: all 0.5s ease;
                }
                :global(.emoji):hover {
                    -webkit-transform: rotate(-20deg);
                    -webkit-filter: brightness(1.25);
                }

                .currentpage-text-container {
                    display: flex;
                }
                @media only screen and (max-width: 600px) {
                    .currentpage-text-container {
                        display: none;
                    }
                }

                .slash {
                    color: gray;
                    font-size: 30px;
                }
                .currentpage {
                    margin-top: 5px;
                }

                .loginBtn {
                    margin-left: auto;
                    margin-right: 10px;
                }
                .loginBtn:hover {
                    color: #33ffaa;
                }

                a {
                    color: black;
                }

                h1 {
                    margin-bottom: 0;
                    margin-left: 10px;
                    font-size: 25px;
                }

                h2 {
                    margin: 0;
                    padding: 0;
                    display: inline-block;
                    color: white;
                }
                h2:hover {
                    cursor: pointer;
                }
            `}</style>
        </div>
    )
}

export default Header
