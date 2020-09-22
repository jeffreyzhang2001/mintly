import PropTypes from 'prop-types'
import { useState } from 'react'
import axios from 'axios'

import cn from 'classnames'
import { Button, AutoComplete } from 'antd'

const SearchTicker = ({ className, onSelect }) => {
    const [autoCompleteValue, setAutoCompleteValue] = useState('')
    const [autoCompleteData, setAutoCompleteData] = useState([])
    const handleSearch = (text) => {
        const renderLabel = (symbol, name) => {
            return {
                value: symbol,
                label: (
                    <div
                        style={{
                            display: 'flex',
                        }}
                    >
                        <span style={{ fontWeight: 600 }}>{symbol}</span>
                        <span style={{ marginLeft: 'auto' }}>{name}</span>
                    </div>
                ),
            }
        }

        const getTickerFromAPI = async (text) => {
            const res = await axios.get(`/api/search/${text}`)
            const stocks = res.data?.matches?.map((stock) =>
                renderLabel(stock.symbol, stock.name),
            )
            setAutoCompleteData(stocks)
        }

        if (text && text.match(/^[0-9a-zA-Z]+$/)) {
            setAutoCompleteValue(text)
            getTickerFromAPI(text)
        } else {
            setAutoCompleteValue(text)
            setAutoCompleteData([])
        }
    }

    return (
        <>
            <AutoComplete
                className={cn('autocomplete', className)}
                placeholder="Search Ticker (e.g. AAPL)"
                options={autoCompleteData}
                value={autoCompleteValue}
                onChange={(text) => handleSearch(text)}
                onSelect={(value) => {
                    onSelect(value)
                    setAutoCompleteData([])
                }}
            />
            <style jsx>{`
                :global(.autocomplete) {
                    width: 100%;
                    background: #cfd7ff;
                    border: 1px solid #33ffaa;
                    box-shadow: 3px 4px 0px #008f53;
                }
            `}</style>
        </>
    )
}

SearchTicker.propTypes = {
    className: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
}

export default SearchTicker
