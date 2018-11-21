import React, { useRef, useEffect, useState } from 'react'
import './App.scoped.scss'
import MainTools from './components/MainTools/MainTools'

let lastHandler = null

const App = () => {
  const canvasRef = useRef(null)
  const { current: self } = useRef({})
  const [activeTool, setTool] = useState(null)

  const handleMouseDown = e => {
    self.isDown = true
  }

  const handleMouseMove = () => {
    if (self.isDown) {
      console.log(activeTool)
      if (activeTool === 'rect') {
        console.log(self.ctx)
        self.ctx.fillStyle = 'red'
        self.ctx.fillRect(0, 0, 500, 500)
      }
      console.log('move')
    }
  }

  console.log(lastHandler === handleMouseMove)
  console.log(lastHandler)
  console.log(handleMouseMove)

  lastHandler = handleMouseMove

  const handleMouseUp = () => {
    self.isDown = false
  }

  useEffect(() => {
    console.log('mounted')
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    self.ctx = canvasRef.current.getContext('2d')

    return () => {
      console.log('unmount')
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
