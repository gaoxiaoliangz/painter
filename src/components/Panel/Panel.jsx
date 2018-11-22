import React from 'react'
import pt from 'prop-types'
import './Panel.scoped.scss'

const Panel = ({ renderFooter, title, children }) => {
  return (
    <div className="panel">
      <h3 className="panel-title">{title}</h3>
      <div className="panel-content">{children}</div>
      {renderFooter && <div className="panel-footer">{renderFooter()}</div>}
    </div>
  )
}

Panel.propTypes = {
  title: pt.string.isRequired,
  renderFooter: pt.func,
}

export default Panel
