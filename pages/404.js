import Link from 'next/link'
import { Result, Button } from 'antd'

const Custom404 = () => {
    return (
        <div className="container">
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link href="/">
                        <Button type="primary">Back Home</Button>
                    </Link>
                }
            />
            <style jsx>{`
                .container {
                    min-height: calc(80vh - 3.75rem);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                :global(.ant-result-title, .ant-result-subtitle) {
                    color: white !important;
                }
            `}</style>
        </div>
    )
}

export default Custom404
