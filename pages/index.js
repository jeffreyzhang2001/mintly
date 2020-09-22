import Link from 'next/link'

import useAuth from '../utils/hooks/useAuth'

import { Button } from 'antd'
import TextLoop from 'react-text-loop'
import Twemoji from 'react-twemoji'

const Index = () => {
    const { user } = useAuth()

    return (
        <div className="container">
            <main>
                <h1 className="title">Mintly</h1>
                <div className="description">
                    <p>Paper trading, supercharged.</p>
                    <TextLoop interval={2000} mask={true}>
                        <span>Real-time market data.</span>
                        <span>Completely free, forever.</span>
                        <span>Trade options stress-free.</span>
                        <span>Manage multiple portfolios.</span>
                    </TextLoop>
                </div>
                <div className="btn-container">
                    {user ? (
                        <Link href="/dashboard">
                            <Button type="primary" shape="round" size="large">
                                Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <Link href={'/register'}>
                            <Button type="primary" shape="round" size="large">
                                Get Started
                            </Button>
                        </Link>
                    )}
                </div>
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

                p {
                    margin-bottom: 5px;
                }

                .title {
                    margin-bottom: 15px;
                    line-height: 1.15;
                    font-size: 4rem;
                    font-weight: 600;
                }

                .title,
                .description {
                    text-align: center;
                }

                .description {
                    margin-bottom: 25px;
                    line-height: 1.5;
                    font-size: 1.5rem;
                }

                .btn-container {
                    margin-bottom: 15px;
                }
            `}</style>
        </div>
    )
}

export default Index
