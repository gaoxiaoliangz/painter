import React, { useRef, useEffect, useState } from 'react'
import MainTools from './components/MainTools/MainTools'
import Panel from './components/Panel/Panel'
import PanelButton from './components/PanelButton/PanelButton'
import Layer from './components/Layer/Layer'
import userImmerState from './hooks/useImmerState'
import './App.scoped.scss'
import Canvas from './components/Canvas/Canvas'
import { objectToImageData, mergeImageData } from './core/canvas'

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
      shapes: [],
      imageData: null,
      ...initialState,
    }
  }

  const canvasRef = useRef(null)
  const { current: self } = useRef({})
  const [activeTool, setTool] = useState(null)
  const [layers, updateLayers] = userImmerState([])
  const selectedLayers = layers.filter(l => l.selected)
  const activeLayer = selectedLayers.length === 1 ? selectedLayers[0] : null

  const updateLayer = layer => {
    updateLayers(draftLayers => {
      return draftLayers.map(l => {
        return l.id === layer.id
          ? {
              ...l,
              ...layer,
            }
          : l
      })
    })
  }

  self.state = {
    activeTool,
    activeLayer,
    updateLayers,
    updateLayer,
  }

  useEffect(() => {
    self.ctx = canvasRef.current.canvas.getContext('2d')
    updateLayers(draftLayers => [
      createLayer({
        selected: true,
      }),
      ...draftLayers,
    ])
  }, [])

  const handleMouseDown = e => {
    self.isDown = true
    const img = activeLayer.imageData
    self.startDot = {
      x: e.pageX,
      y: e.pageY,
    }
    self.lastImg = img
  }

  const handleMouseMove = e => {
    if (self.isDown) {
      if (activeTool === 'rect') {
        const imageData = objectToImageData({
          type: 'rect',
          x: self.startDot.x,
          y: self.startDot.y,
          width: e.pageX - self.startDot.x,
          height: e.pageY - self.startDot.y,
          color: 'green',
        })
        updateLayer({
          id: activeLayer.id,
          imageData: self.lastImg
            ? mergeImageData(self.lastImg, imageData)
            : imageData,
        })
      }
    }
  }

  const handleMouseUp = () => {
    self.isDown = false
  }

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <MainTools
        value={activeTool}
        onChange={tool => {
          setTool(tool)
        }}
      />
      <Canvas ref={canvasRef} layers={layers} width="500" height="500" />
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
