import { useEffect } from 'react'
import { useRouter } from 'next/router'
import NProgress from 'nprogress'

const NextNProgress = () => {
    const router = useRouter()

    useEffect(() => {
        const handleRouteChangeStart = (url) => {
            NProgress.start()
        }
        const handleRouteChangeComplete = (url) => {
            NProgress.done()
        }
        const handleRouteChangeError = (err, url) => {
            NProgress.done()
        }

        router.events.on('routeChangeStart', handleRouteChangeStart)
        router.events.on('routeChangeComplete', handleRouteChangeComplete)
        router.events.on('routeChangeError', handleRouteChangeError)

        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart)
            router.events.off('routeChangeComplete', handleRouteChangeComplete)
            router.events.off('routeChangeError', handleRouteChangeError)
        }
    }, [])

    return (
        <style jsx global>{`
            #nprogress {
                pointer-events: none;
            }
            #nprogress .bar {
                background: white;
                position: fixed;
                z-index: 100;
                top: 70px;
                left: 0;
                width: 100%;
                height: 1.5px;
            }
        `}</style>
    )
}

export default NextNProgress
