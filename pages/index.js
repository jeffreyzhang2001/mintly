import Head from 'next/head'
import Link from 'next/link'
import { useUser } from '../utils/auth/useUser'

import Twemoji from 'react-twemoji'

const Index = () => {
    const { user } = useUser()

    return (
        <div className="container">
            <Head>
                <title>Mintly</title>
                <link
                    rel="icon"
                    href="https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/twitter/248/leaf-fluttering-in-wind_1f343.png"
                />
            </Head>

            <main>
                <h1 className="title">Mintly</h1>
                <p className="description">Paper trading, simplified.</p>
                {user ? (
                    <Link href="/dashboard">
                        <a>Dashboard</a>
                    </Link>
                ) : (
                    <Link href={'/login'}>
                        <a>Get Started</a>
                    </Link>
                )}
                <Twemoji options={{ className: 'emoji' }}>🍃</Twemoji>
            </main>

            <style jsx>{`
                .container {
                    min-height: calc(100vh - 3.75rem);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                main {
                    padding: 8rem 0;
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                a {
                    color: inherit;
                    text-decoration: none;
                }

                .emoji {
                    width: 100em !important;
                    height: 100em !important;
                }

                .title {
                    margin: 0;
                    line-height: 1.15;
                    font-size: 4rem;
                    font-weight: 600;
                }

                .title,
                .description {
                    text-align: center;
                }

                .description {
                    line-height: 1.5;
                    font-size: 1.5rem;
                }

                .logo {
                    height: 1em;
                }
            `}</style>
        </div>
    )
}

export default Index
