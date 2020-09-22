import PropTypes from 'prop-types'
import { Form, Input } from 'antd'

const BankrollSizeInput = ({ bankrollSize, onChange }) => {
    return (
        <Form.Item>
            <Input
                value={bankrollSize}
                maxLength="5"
                bordered="false"
                onChange={(e) => {
                    const newValue = parseInt(e.target.value)
                    if (Number.isNaN(newValue)) {
                        onChange(0)
                        return
                    } else if (newValue < 0) {
                        return
                    }
                    onChange(Number(newValue))
                }}
            />
        </Form.Item>
    )
}

BankrollSizeInput.propTypes = {
    bankrollSize: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default BankrollSizeInput
