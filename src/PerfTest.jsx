import React, { useRef, useEffect } from 'react'
import {
  createShape,
  shapeToImageFragment,
  mergeImageFragments,
  mergeImageFragmentsOld,
  drawShapeOnCanvas,
} from './core/canvas'
import { interpolateDots } from './utils'

const Test = props => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const dots = [
      ...interpolateDots({ x: 10, y: 10 }, { x: 400, y: 400 }),
      ...interpolateDots({ x: 20, y: 10 }, { x: 400, y: 400 }),
      ...interpolateDots({ x: 30, y: 10 }, { x: 400, y: 400 }),
      ...interpolateDots({ x: 40, y: 10 }, { x: 400, y: 400 }),
    ]
    const dotShapes = dots.map(dot =>
      createShape('cycle', {
        x: dot.x,
        y: dot.y,
        r: 3,
        color: 'blue',
      })
    )
    const dotImgFrags = dotShapes.map(shapeToImageFragment)
    const shapes = [
      createShape('rect', {
        x: -20,
        y: 0,
        width: 50,
        height: 50,
        color: 'red',
      }),
      createShape('rect', {
        x: 50,
        y: 0,
        width: 50,
        height: 50,
        color: 'green',
      }),
      createShape('rect', {
        x: 150,
        y: 0,
        width: -50,
        height: 50,
        color: 'blue',
      }),
      createShape('cycle', {
        x: 0,
        y: 0,
        r: 50,
        color: 'yellow',
      }),
    ]
    const frags = shapes.map(shapeToImageFragment)
    console.time('--- perf test ---')
    // const merged = mergeImageFragmentsOld([...frags, ...dotImgFrags])
    // drawShapeOnCanvas
    ;[...dotShapes, ...shapes].forEach(shape =>
      drawShapeOnCanvas(shape, canvas)
    )
    console.timeEnd('--- perf test ---')

    // const putFrag = frag => {
    //   ctx.putImageData(frag.imageData, frag.x, frag.y)
    // }
    // putFrag(merged)
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
