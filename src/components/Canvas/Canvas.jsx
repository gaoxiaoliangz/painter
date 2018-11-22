import React, { useEffect, useRef, useImperativeMethods } from 'react'
import pt from 'prop-types'

const Canvas = React.forwardRef(({ layers, ...rest }, ref) => {
  const canvasRef = useRef(null)
  const { current: self } = useRef({})

  // useEffect(() => {
  //   console.log('mounted')
  // }, [])

  useEffect(() => {
    console.log('updated')
    const { ctx } = self
    if (!ctx) {
      self.ctx = canvasRef.current.getContext('2d')
    }
  })

  useImperativeMethods(ref, () => {
    return {
      renderLayers: () => {
        console.log('render layers')
      },
    }
  })

  return <canvas {...rest} ref={canvasRef} />
})

Canvas.propTypes = {
  layers: pt.array.isRequired,
}

export default Canvas
