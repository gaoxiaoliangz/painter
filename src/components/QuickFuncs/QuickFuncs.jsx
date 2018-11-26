import React from 'react'
import pt from 'prop-types'
import './QuickFuncs.scoped.scss'
import PanelButton from '../PanelButton/PanelButton'

const tools = ['zoom-in', 'zoom-out']

const QuickFuncs = ({ onTrigger }) => {
  return (
    <div className="quick-funcs">
      {tools.map(tool => {
        return (
          <PanelButton key={tool} icon={tool} onClick={() => onTrigger(tool)} />
        )
      })}
    </div>
  )
}

QuickFuncs.propTypes = {
  onTrigger: pt.func.isRequired,
}

export default QuickFuncs
