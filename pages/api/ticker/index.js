export default (req, res) => {
    res.status(200).json({
        error: 'Endpoint requires a ticker (e.g. /api/quote/AAPL)',
    })
}
