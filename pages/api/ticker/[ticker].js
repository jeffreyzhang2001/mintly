export default async (req, res) => {
    let {
        query: { ticker },
    } = req
    ticker = ticker.toUpperCase()

    const finnhub = require('finnhub')

    const api_key = finnhub.ApiClient.instance.authentications['api_key']
    api_key.apiKey = process.env.FINNHUB_API_KEY
    const finnhubClient = new finnhub.DefaultApi()

    // Utils
    const uniqByProp = (array, prop) => {
        let seen = {}
        return array.filter((item) => {
            const k = item[prop]
            return seen.hasOwnProperty(k) ? false : (seen[k] = true)
        })
    }
    const currentDate = new Date().toISOString().split('T')[0]
    const weekAgoDate = new Date(new Date() - 6.048e8)
        .toISOString()
        .split('T')[0]

    let promiseError
    let priceData
    const quotePromise = new Promise((resolve, reject) => {
        finnhubClient.quote(ticker, (error, data, response) => {
            const { o, h, l, c, pc } = data || {}
            if ((!o && !h && !l && !c && !pc) || error) {
                promiseError = true
                resolve()
            } else {
                priceData = {
                    open: o,
                    high: h,
                    low: l,
                    current: Number.parseFloat(c.toFixed(2)),
                    prevClose: pc,
                    dollarChange: c - pc,
                    percentChange: Number.parseFloat(
                        (((c - pc) / pc) * 100).toFixed(2),
                    ),
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
                    if (data?.length) {
                        companyNews = uniqByProp(data.slice(0, 15), 'headline')
                    }
                    resolve()
                }
            },
        )
    })

    await Promise.all([
        quotePromise,
        recommendationTrendsPromise,
        companyNewsPromise,
    ])
    if (promiseError) {
        return res.status(404).json({
            status: 404,
            message: 'Ticker not found',
        })
    } else {
        res.status(200).json({ priceData, recommendationTrends, companyNews })
    }
}
