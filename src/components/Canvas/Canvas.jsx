import React, { useEffect, useRef, useImperativeMethods } from 'react'
import pt from 'prop-types'
import { mergeImageFragments, shapeToImageFragment } from '../../core/canvas'
import { reverse } from '../../utils'

const shapesToImageFragment = shapes => {
  if (!shapes || shapes.length === 0) {
    return null
  }
  return mergeImageFragments(shapes.map(shapeToImageFragment))
}

const layerToImageFragment = ({ shapes, imageFragment }) => {
  if (imageFragment) {
    return mergeImageFragments([imageFragment, shapesToImageFragment(shapes)])
  }
  return shapesToImageFragment(shapes)
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
    const imageFragment = mergeImageFragments(
      reverse(layers.filter(layer => layer.visible).map(layerToImageFragment)),
    )
    if (imageFragment) {
      ctx.putImageData(
        imageFragment.imageData,
        imageFragment.x,
        imageFragment.y,
      )
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
