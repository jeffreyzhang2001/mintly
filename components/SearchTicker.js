import PropTypes from 'prop-types'
import { useState } from 'react'
import axios from 'axios'

import cn from 'classnames'
import { AutoComplete, Input } from 'antd'

const SearchTicker = ({ autoCompleteClassName, inputClassName, onSelect }) => {
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
                className={cn('autocomplete', autoCompleteClassName)}
                options={autoCompleteData}
                value={autoCompleteValue}
                onSelect={(value, option) => {
                    onSelect({
                        symbol: value,
                        name: option.label.props.children[1].props.children,
                    })
                    setAutoCompleteValue(value)
                    setAutoCompleteData([])
                }}
            >
                <Input
                    className={inputClassName}
                    size="large"
                    placeholder="Search for symbols or companies (e.g. AAPL)"
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </AutoComplete>
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
    autoCompleteClassName: PropTypes.string,
    inputClassName: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
}

export default SearchTicker
