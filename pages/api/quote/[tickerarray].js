export default async (req, res) => {
    let {
        query: { tickerarray },
    } = req
    const tickers = tickerarray.toUpperCase().split(',')

    const finnhub = require('finnhub')

    const api_key = finnhub.ApiClient.instance.authentications['api_key']
    api_key.apiKey = process.env.FINNHUB_API_KEY
    const finnhubClient = new finnhub.DefaultApi()

    let promiseArray = []
    let promiseError
    let portfolioEquitiesPriceData = {}
    for (const ticker of tickers) {
        promiseArray.push(
            new Promise((resolve, reject) => {
                finnhubClient.quote(ticker, (error, data, response) => {
                    const { o, h, l, c, pc } = data || {}
                    if ((!o && !h && !l && !c && !pc) || error) {
                        promiseError = true
                        resolve()
                    } else {
                        portfolioEquitiesPriceData[ticker] = {
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
            }),
        )
    }

    await Promise.all(promiseArray)
    if (promiseError) {
        return res.status(404).json({
            status: 404,
            message: 'One of the tickers was invalid',
        })
    } else {
        res.status(200).json({ portfolioEquitiesPriceData })
    }
}
