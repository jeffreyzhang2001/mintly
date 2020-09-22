export default async (req, res) => {
    let {
        query: { ticker },
    } = req
    ticker = ticker.toUpperCase()

    const finnhub = require('finnhub')

    const api_key = finnhub.ApiClient.instance.authentications['api_key']
    api_key.apiKey = process.env.FINNHUB_API_KEY
    const finnhubClient = new finnhub.DefaultApi()
    const currentDate = new Date().toISOString().split('T')[0]
    const weekAgoDate = new Date(new Date() - 6.048e8)
        .toISOString()
        .split('T')[0]

    let promiseError
    let quote
    const quotePromise = new Promise((resolve, reject) => {
        finnhubClient.quote(ticker, (error, data, response) => {
            const { o, h, l, c, pc } = data
            if ((!o && !h && !l && !c && !pc) || error) {
                promiseError = true
                resolve()
            } else {
                quote = {
                    ticker,
                    open: o,
                    high: h,
                    low: l,
                    current: c,
                    prevClose: pc,
                }
                resolve()
            }
        })
    })

    let recommendationTrends
    const recommendationTrendsPromise = new Promise((resolve, reject) => {
        finnhubClient.recommendationTrends(ticker, (error, data, response) => {
            if (error) {
                promiseError = error
                resolve()
            } else {
                recommendationTrends = data?.[0]
                resolve()
            }
        })
    })

    let companyNews
    const companyNewsPromise = new Promise((resolve, reject) => {
        finnhubClient.companyNews(
            ticker,
            weekAgoDate,
            currentDate,
            (error, data, response) => {
                if (error) {
                    promiseError = error
                    resolve()
                } else {
                    companyNews = data
                    resolve()
                }
            },
        )
    })

    await Promise.all([quotePromise, companyNewsPromise])
    if (promiseError) {
        return res.status(404).json({
            status: 404,
            message: 'Ticker not found',
        })
    } else {
        res.status(200).json({ quote, recommendationTrends, companyNews })
    }
}
