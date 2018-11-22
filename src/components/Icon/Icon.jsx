import React from 'react'
import PT from 'prop-types'

const Icon = ({ type, className, ...rest }) => {
  return <i {...rest} className={`iconfont icon-${type} ${className || ''}`} />
}

Icon.propTypes = {
  type: PT.string.isRequired
}

export default Icon
