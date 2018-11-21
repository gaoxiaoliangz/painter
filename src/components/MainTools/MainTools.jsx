import React from 'react'
import pt from 'prop-types'
import Toolbox from '../Toolbox/Toolbox'
import './MainTools.scoped.scss'

const tools = ['move', 'rect']

const MainTools = props => {
  return (
    <div className="main-tools">
      <Toolbox
        tools={tools.map(tool => {
          return {
            icon: tool,
            active: tool === props.value,
            onActivate: () => {
              props.onChange(tool)
            },
          }
        })}
      />
    </div>
  )
}

MainTools.propTypes = {
  value: pt.string,
  onChange: pt.func.isRequired,
}

export default MainTools
