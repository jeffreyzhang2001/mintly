export default (req, res) => {
    let {
        query: { ticker },
    } = req
    ticker = ticker.toUpperCase()

    const finnhub = require('finnhub')

    const api_key = finnhub.ApiClient.instance.authentications['api_key']
    api_key.apiKey = process.env.FINNHUB_API_KEY
    const finnhubClient = new finnhub.DefaultApi()

    finnhubClient.quote(ticker, (error, data, response) => {
        const { o, h, l, c, pc } = data
        if ((!o && !h && !l && !c && !pc) || error) {
            return res.status(404).json({
                status: 404,
                message: 'Ticker not found',
            })
        } else {
            res.status(200).json({
                ticker,
                open: o,
                high: h,
                low: l,
                current: c,
                prevClose: pc,
            })
        }
    })
}
