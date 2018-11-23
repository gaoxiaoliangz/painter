import React, { useEffect, useRef, useImperativeMethods } from 'react'
import pt from 'prop-types'
import { mergeImageData, objectToImageData } from '../../core/canvas'
import { reverse } from '../../utils'

const shapesToImageData = shapes => {
  if (!shapes || shapes.length === 0) {
    return null
  }
  return mergeImageData(
    shapes.map(objectToImageData).map(imageData => ({ imageData }))
  )
}

const layerToImageData = ({ shapes, imageData, offset }) => {
  if (imageData) {
    return mergeImageData([
      { imageData },
      { imageData: shapesToImageData(shapes) },
    ])
  }
  return shapesToImageData(shapes)
}

const Canvas = React.forwardRef(({ layers, ...rest }, ref) => {
  const canvasRef = useRef(null)
  const { current: self } = useRef({})

  useEffect(() => {
    renderLayers()
  })

  useImperativeMethods(ref, () => {
    return {
      renderLayers,
      canvas: canvasRef.current,
    }
  })

  const renderLayers = () => {
    let { ctx } = self
    if (!ctx) {
      self.ctx = canvasRef.current.getContext('2d')
      ctx = self.ctx
    }
    const imageData = mergeImageData(
      reverse(
        layers
          .filter(layer => layer.visible)
          .map(layer => ({
            imageData: layerToImageData(layer.imageData),
            offset: layer.offset,
          }))
          .filter(obj => (obj.imageData))
      )
    )
    if (imageData) {
      ctx.putImageData(imageData, 0, 0)
    } else {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  return <canvas {...rest} ref={canvasRef} />
})

Canvas.propTypes = {
  layers: pt.array.isRequired,
}

export default Canvas
