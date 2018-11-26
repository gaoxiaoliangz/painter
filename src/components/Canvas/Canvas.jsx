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
  // const { current: self } = useRef({})
  const { current: canvas } = canvasRef

  useEffect(() => {
    renderLayers()
  })

  useImperativeMethods(ref, () => {
    return {
      renderLayers,
      // 不能直接写 canvas?
      canvas: canvasRef.current,
    }
  })

  const renderLayers = () => {
    if (!canvas) {
      return
    }
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const imageFragment = mergeImageFragments(
      reverse(layers.filter(layer => layer.visible).map(layerToImageFragment))
    )
    if (imageFragment) {
      ctx.putImageData(
        imageFragment.imageData,
        imageFragment.x,
        imageFragment.y
      )
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  return <canvas {...rest} ref={canvasRef} />
})

Canvas.propTypes = {
  layers: pt.array.isRequired,
}

export default Canvas
