import React, { useRef, useEffect, useState } from 'react'
import MainTools from './components/MainTools/MainTools'
import Panel from './components/Panel/Panel'
import PanelButton from './components/PanelButton/PanelButton'
import Layer from './components/Layer/Layer'
import userImmerState from './hooks/useImmerState'
import './App.scoped.scss'

const App = () => {
  const createLayer = initialState => {
    if (self.layerId === undefined) {
      self.layerId = 0
    }
    const id = self.layerId++
    return {
      id,
      thumb: 'thumb',
      label: `New layer ${id}`,
      visible: true,
      selected: false,
      ...initialState,
    }
  }

  const canvasRef = useRef(null)
  const { current: self } = useRef({})
  const [activeTool, setTool] = useState(null)
  const [layers, updateLayers] = userImmerState([])

  self.state = {
    activeTool,
  }

  useEffect(() => {
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    self.ctx = canvasRef.current.getContext('2d')
    updateLayers(draftLayers => [
      createLayer({
        selected: true,
      }),
      ...draftLayers,
    ])

    return () => {
      // @todo: clean up
    }
  }, [])

  const handleMouseDown = e => {
    self.isDown = true
    const { ctx } = self
    const img = ctx.getImageData(0, 0, 500, 500)
    self.startDot = {
      x: e.pageX,
      y: e.pageY,
    }
    self.lastImg = img
  }

  const handleMouseMove = e => {
    const { activeTool } = self.state
    if (self.isDown) {
      if (activeTool === 'rect') {
        const { ctx } = self
        self.ctx.fillStyle = 'red'
        ctx.putImageData(self.lastImg, 0, 0)
        self.ctx.fillRect(
          self.startDot.x,
          self.startDot.y,
          e.pageX - self.startDot.x,
          e.pageY - self.startDot.y
        )
      }
    }
  }

  const handleMouseUp = () => {
    self.isDown = false
  }

  return (
    <div>
      <MainTools
        value={activeTool}
        onChange={tool => {
          setTool(tool)
        }}
      />
      <canvas width="500" height="500" ref={canvasRef} />
      <div className="right-panels">
        <Panel
          title="Layers"
          renderFooter={() => {
            return (
              <div>
                <PanelButton
                  icon="add"
                  onClick={() => {
                    updateLayers(draftLayers =>
                      [createLayer(), ...draftLayers].map((layer, idx) => {
                        return {
                          ...layer,
                          selected: idx === 0,
                        }
                      })
                    )
                  }}
                />
                <PanelButton
                  icon="delete"
                  onClick={() => {
                    updateLayers(draftLayers => {
                      return draftLayers
                        .filter(layer => {
                          return !layer.selected
                        })
                        .map((layer, idx) => {
                          return {
                            ...layer,
                            selected: idx === 0,
                          }
                        })
                    })
                  }}
                />
              </div>
            )
          }}
        >
          {layers.map((layer, idx) => {
            return (
              <Layer
                {...layer}
                onChange={layerState => {
                  updateLayers(draftLayers => {
                    draftLayers[idx] = {
                      ...draftLayers[idx],
                      ...layerState,
                    }
                  })
                }}
                key={layer.id}
              />
            )
          })}
        </Panel>
      </div>
    </div>
  )
}

export default App
