export default (req, res) => {
    res.status(200).json({
        error:
            'Endpoint requires an array of tickers (e.g. /api/quote/AAPL,FB,TSLA)',
    })
}
