export default (req, res) => {
    res.status(200).json({
        error:
            'Endpoint requires a search fragment (e.g. /api/search/American)',
    })
}
