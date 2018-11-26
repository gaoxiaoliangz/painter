import React, { useRef, useEffect, useState } from 'react'
import MainTools from './components/MainTools/MainTools'
import Panel from './components/Panel/Panel'
import PanelButton from './components/PanelButton/PanelButton'
import Layer from './components/Layer/Layer'
import userImmerState from './hooks/useImmerState'
import './App.scoped.scss'
import Canvas from './components/Canvas/Canvas'
import {
  createShape,
  mergeImageFragments,
  shapeToImageFragment,
} from './core/canvas'
import ColorPicker from './components/ColorPicker/ColorPicker'
import { calcDistance } from './utils'

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
      imageFragment: null,
      ...initialState,
    }
  }

  const canvasRef = useRef(null)
  const { current: self } = useRef({})
  const [activeTool, setTool] = useState('cycle')
  const [color, setColor] = useState('#000000')
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
    if (activeLayer) {
      self.isDown = true
      const { imageFragment } = activeLayer
      self.startDot = {
        x: e.pageX,
        y: e.pageY,
      }
      self.lastImageFragment = imageFragment
    }
  }

  const handleMouseMove = e => {
    if (self.isDown) {
      switch (activeTool) {
        case 'rect': {
          const imageFragment = shapeToImageFragment(
            createShape('rect', {
              x: self.startDot.x,
              y: self.startDot.y,
              width: e.pageX - self.startDot.x,
              height: e.pageY - self.startDot.y,
              color,
            })
          )
          updateLayer({
            id: activeLayer.id,
            imageFragment: self.lastImageFragment
              ? mergeImageFragments([self.lastImageFragment, imageFragment])
              : imageFragment,
          })
          break
        }

        case 'cycle': {
          const r = calcDistance(self.startDot, {
            x: e.pageX,
            y: e.pageY,
          })
          const imageFragment = shapeToImageFragment(
            createShape('cycle', {
              x: self.startDot.x,
              y: self.startDot.y,
              r,
              color,
            })
          )
          updateLayer({
            id: activeLayer.id,
            imageFragment: self.lastImageFragment
              ? mergeImageFragments([self.lastImageFragment, imageFragment])
              : imageFragment,
          })
          break
        }

        case 'move':
          // @todo: shapes
          updateLayer({
            id: activeLayer.id,
            imageFragment: {
              ...self.lastImageFragment,
              x: self.lastImageFragment.x + e.pageX - self.startDot.x,
              y: self.lastImageFragment.y + e.pageY - self.startDot.y,
            },
          })
          break

        default:
          throw new Error(`Unknown tool ${activeTool}`)
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
                    if (layerState.selected !== undefined) {
                      draftLayers.forEach((layer, idx2) => {
                        if (idx !== idx2) {
                          layer.selected = false
                        } else {
                          layer.selected = layerState.selected
                        }
                      })
                    } else {
                      draftLayers[idx] = {
                        ...draftLayers[idx],
                        ...layerState,
                      }
                    }
                  })
                }}
                key={layer.id}
              />
            )
          })}
        </Panel>
        <Panel title="Color">
          <ColorPicker
            value={color}
            onChange={e => {
              setColor(e.hex)
            }}
          />
        </Panel>
      </div>
    </div>
  )
}

export default App
