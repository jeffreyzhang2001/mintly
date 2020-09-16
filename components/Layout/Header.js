import Link from 'next/link'
import useAuth from '../../utils/hooks/useAuth'

import { Button } from 'antd'
import Twemoji from 'react-twemoji'

const Header = () => {
    const { user } = useAuth()

    return (
        <div>
            <header>
                <Link href="/">
                    <a>
                        <Twemoji options={{ className: 'emoji' }}>🍃</Twemoji>
                    </a>
                </Link>
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
            </header>
            <style jsx>{`
                header {
                    display: flex;
                    align-items: center;
                    /justify-content: space-between;
                    padding: 0 15px 0 15px;
                    background-color: #121212;
                    position: absolute;
                    top: 0;
                    width: 100%;
                    height: 70px;
                    overflow: hidden;
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
