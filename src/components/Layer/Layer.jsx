import React from 'react'
import classNames from 'classnames'
import pt from 'prop-types'
import './Layer.scoped.scss'
import PanelButton from '../PanelButton/PanelButton'

const Layer = ({ thumb, label, visible, selected, onChange }) => {
  return (
    <div
      className={classNames({ layer: true, 'layer--selected': selected })}
      onClick={() => {
        onChange({
          selected: !selected,
        })
      }}
    >
      <PanelButton
        active={visible}
        icon="eye"
        onClick={e => {
          e.stopPropagation()
          onChange({
            visible: !visible,
          })
        }}
      />
      {thumb}
      {label}
    </div>
  )
}

Layer.propTypes = {
  thumb: pt.string,
  label: pt.string.isRequired,
}

export default Layer
