import React from 'react'
import pt from 'prop-types'
import './Toolbox.scoped.scss'

const Toolbox = props => {
  return (
    <div>
      {props.tools.map(tool => {
        return (
          <div
            key={tool.icon}
            className={tool.active ? 'tool tool--active' : 'tool'}
            onClick={tool.onActivate}
          >
            {tool.icon}
          </div>
        )
      })}
    </div>
  )
}

Toolbox.propTypes = {
  tools: pt.array.isRequired,
}

export default Toolbox
