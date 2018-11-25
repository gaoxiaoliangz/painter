import React, { useRef, useEffect } from 'react'
import {
  createShape,
  shapeToImageFragment,
  mergeImageFragments,
} from './core/canvas'

const Test = props => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const shape = createShape('rect', {
      x: -20,
      y: 0,
      width: 50,
      height: 50,
      color: 'red',
    })
    const shape2 = createShape('rect', {
      x: 50,
      y: 0,
      width: 50,
      height: 50,
      color: 'green',
    })
    const imageFrag = shapeToImageFragment(shape)
    const imageFrag2 = shapeToImageFragment(shape2)
    const merged = mergeImageFragments([imageFrag, imageFrag2])

    const putFrag = frag => {
      ctx.putImageData(frag.imageData, frag.x, frag.y)
    }
    // putFrag(mergeImageFragments([imageFrag]))
    putFrag(merged)
  }, [])

  return (
    <canvas
      style={{
        background: '#fff',
      }}
      ref={canvasRef}
      width="500"
      height="500"
    />
  )
}

Test.propTypes = {}

export default Test
