const defaultCanvasConfig = {
  width: 500,
  height: 500,
}

const createCanvas = (config = {}) => {
  const newCanvas = document.createElement('canvas')
  newCanvas.width = config.width || defaultCanvasConfig.width
  newCanvas.height = config.height || defaultCanvasConfig.height
  document.body.appendChild(newCanvas)
  newCanvas.setAttribute('class', config.class)
  newCanvas.setAttribute('style', 'position: fixed; top: -999em;')
  return newCanvas
}

const offscreenCanvases = {
  objectToImageData: createCanvas({ class: 'objectToImageData' }),
  imageDataToDataURL: createCanvas({ class: 'imageDataToDataURL' }),
  mergeImageData: createCanvas({ class: 'mergeImageData' }),
  bufferCanvas: createCanvas({ class: 'bufferCanvas' }),
}

/**
 * object
 * type: rect, x, y, width, height, color, stroke, radius?
 */
export const objectToImageData = ({ type, ...rest }, canvasConfig) => {
  const canvas = offscreenCanvases.objectToImageData
  const ctx = canvas.getContext('2d')
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
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  return imageData
}

export const imageDataToDataURL = imageData => {
  const canvas = offscreenCanvases.imageDataToDataURL
  const ctx = canvas.getContext('2d')
  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/png')
}

const getCanvasWithImageData = imageData => {
  const canvas = offscreenCanvases.bufferCanvas
  const ctx = canvas.getContext('2d')
  ctx.putImageData(imageData, 0, 0)
  return canvas
}

export const mergeImageData = imageDataArr => {
  console.time(`merging ${imageDataArr.length}`)
  const canvas = offscreenCanvases.mergeImageData
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  imageDataArr.forEach(obj => {
    if (!obj || !obj.imageData) {
      return
    }
    const { imageData, offset } = obj
    ctx.drawImage(getCanvasWithImageData(imageData), ...(offset || [0, 0]))
  })
  console.timeEnd(`merging ${imageDataArr.length}`)
  const result = ctx.getImageData(0, 0, canvas.width, canvas.height)
  return result
}
