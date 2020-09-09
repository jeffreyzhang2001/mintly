import Link from 'next/link'
import { useUser } from '../../utils/auth/useUser'

import { Button } from 'antd'
import Twemoji from 'react-twemoji'

const Header = () => {
    const { user, logout } = useUser()

    return (
        <div>
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
                        <Link href={'/login'}>
                            <h2>Log In</h2>
                        </Link>
                        <Link href={'/login'}>
                            <Button type="primary" shape="round" size="middle">
                                Sign Up
                            </Button>
                        </Link>
                    </>
                )}

                {/* <div className="container">
                    <Twemoji>🍃</Twemoji>
                </div> */}
            </header>
            <style jsx>{`
                header {
                    display: flex;
                    justify-content: space-between;
                    background-color: #121212;
                    position: fixed;
                    width: 100%;
                    height: 70px;
                    overflow: hidden;
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
