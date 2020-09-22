const tickerList = require('./tickerlist.json')

export default async (req, res) => {
    let {
        query: { fragment },
    } = req
    fragment = fragment.toLowerCase()

    let exactMatch
    let exactMatchObj
    let matches = tickerList.filter((stockObj) => {
        if (stockObj.symbol.toLowerCase() === fragment) {
            exactMatch = true
            exactMatchObj = stockObj
            return false
        }
        return JSON.stringify(stockObj).toLowerCase().indexOf(fragment) !== -1
    })
    if (exactMatch) {
        matches.unshift(exactMatchObj)
    }
    res.status(200).json({ matches })
}
