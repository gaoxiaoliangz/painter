import React from 'react'
import './PanelButton.scoped.scss'

const PanelButton = ({ active, onClick, icon }) => {
  return (
    <span className={active ? 'button button--active' : 'button'} onClick={onClick}>
      {icon}
    </span>
  )
}

PanelButton.propTypes = {}

export default PanelButton
