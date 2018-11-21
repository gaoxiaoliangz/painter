import React, { useRef, useEffect, useState } from 'react'
import './App.scoped.scss'
import MainTools from './components/MainTools/MainTools'

const App = () => {
  const canvasRef = useRef(null)
  const { current: self } = useRef({})
  const [activeTool, setTool] = useState(null)

  self.state = {
    activeTool,
  }

  const handleMouseDown = e => {
    self.isDown = true
    self.startDot = {
      x: e.pageX,
      y: e.pageY,
    }
  }

  const handleMouseMove = e => {
    const { activeTool } = self.state
    if (self.isDown) {
      if (activeTool === 'rect') {
        self.ctx.fillStyle = 'red'
        self.ctx.clearRect(0, 0, 500, 500)
        self.ctx.fillRect(
          self.startDot.x,
          self.startDot.y,
          e.pageX - self.startDot.x,
          e.pageY - self.startDot.y,
        )
      }
    }
  }

  const handleMouseUp = () => {
    self.isDown = false
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    self.ctx = canvasRef.current.getContext('2d')

    return () => {
      // @todo: clean up
    }
  }, [])

  return (
    <div>
      <MainTools
        value={activeTool}
        onChange={tool => {
          setTool(tool)
        }}
      />
      <canvas width="500" height="500" ref={canvasRef} />
    </div>
  )
}

export default App
