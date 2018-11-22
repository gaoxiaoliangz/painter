import React from 'react'
import pt from 'prop-types'
import './Toolbox.scoped.scss'
import PanelButton from '../PanelButton/PanelButton'

const Toolbox = props => {
  return (
    <div>
      {props.tools.map(tool => {
        return (
          <PanelButton
            icon={tool.icon}
            active={tool.active}
            key={tool.icon}
            onClick={tool.onActivate}
          />
        )
      })}
    </div>
  )
}

Toolbox.propTypes = {
  tools: pt.array.isRequired,
}

export default Toolbox
