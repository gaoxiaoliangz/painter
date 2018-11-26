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

    const shapes = [
      // createShape('rect', {
      //   x: -20,
      //   y: 0,
      //   width: 50,
      //   height: 50,
      //   color: 'red',
      // }),
      // createShape('rect', {
      //   x: 50,
      //   y: 0,
      //   width: 50,
      //   height: 50,
      //   color: 'green',
      // }),
      // createShape('rect', {
      //   x: 150,
      //   y: 0,
      //   width: -50,
      //   height: 50,
      //   color: 'blue',
      // }),
      createShape('cycle', {
        x: 0,
        y: 0,
        r: 50,
        color: 'yellow',
      }),
    ]
    const frags = shapes.map(shapeToImageFragment)
    const merged = mergeImageFragments(frags)

    const putFrag = frag => {
      ctx.putImageData(frag.imageData, frag.x, frag.y)
    }

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
