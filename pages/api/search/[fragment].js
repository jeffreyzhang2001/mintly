const tickerList = require('./tickerlist.json')

export default async (req, res) => {
    let {
        query: { fragment },
    } = req
    fragment = fragment.toLowerCase()

    const matches = tickerList.filter(
        (stockObj) =>
            JSON.stringify(stockObj).toLowerCase().indexOf(fragment) !== -1,
    )
    res.status(200).json({ matches })
}
