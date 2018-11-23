import React from 'react'
import pt from 'prop-types'
import { ChromePicker } from 'react-color'

const ColorPicker = ({ value, ...rest }) => {
  return <ChromePicker {...rest} color={value} />
}

ColorPicker.propTypes = {
  value: pt.string.isRequired,
  onChange: pt.func.isRequired,
}

export default ColorPicker
