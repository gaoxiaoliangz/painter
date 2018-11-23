let canvas
let ctx

/**
 * object
 * type: rect, x, y, width, height, color, stroke, radius?
 */
export const objectToImageData = ({ type, ...rest }, canvasConfig) => {
  const defaultCanvasConfig = {
    width: 500,
    height: 500,
  }
  const canvasConfigWithDefaults = {
    ...defaultCanvasConfig,
    ...canvasConfig,
  }
  // create canvas
  if (!canvas) {
    canvas = document.createElement('canvas')
    canvas.width = canvasConfigWithDefaults.width
    canvas.height = canvasConfigWithDefaults.height
    document.body.appendChild(canvas)
    ctx = canvas.getContext('2d')
  }
  ctx.save()

  switch (type) {
    case 'rect': {
      const { x, y, width, height, color /*stroke*/ } = rest
      ctx.fillStyle = color
      ctx.fillRect(x, y, width, height)
      break
    }

    default:
      throw new Error(`Unknown type ${type}`)
  }
  ctx.restore()
  const imageData = ctx.getImageData(
    0,
    0,
    canvasConfigWithDefaults.width,
    canvasConfigWithDefaults.height
  )
  ctx.clearRect(
    0,
    0,
    canvasConfigWithDefaults.width,
    canvasConfigWithDefaults.height
  )
  return imageData
}

const fallback = (chain, finalFallback) => {
  for (let i = 0; i < chain.length; i++) {
    if (chain[i]) {
      return [chain[i], i]
    }
  }
  return [finalFallback, -1]
}

export const mergeImageData = (...imageDataArr) => {
  const [head, headIdx] = fallback(imageDataArr)
  if (!head) {
    return null
  }
  const newData = head.data.map((val, idx) => {
    return fallback(
      imageDataArr
        .slice(headIdx + 1)
        .filter(Boolean)
        .map(r => r.data[idx]),
      val
    )[0]
  })
  const newImgData = ctx.createImageData(canvas.width, canvas.height)
  newImgData.data.set(newData)
  return newImgData
}
