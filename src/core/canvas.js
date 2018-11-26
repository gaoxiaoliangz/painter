export class ImageFragment {
  constructor(imageData) {
    this.imageData = imageData
    this.x = 0
    this.y = 0
  }
}

export class Shape {
  constructor(type) {
    this.type = type
    this.x = 0
    this.y = 0
  }
}

export const createImageFragment = (imageData, meta) => {
  const defaultMeta = {
    x: 0,
    y: 0,
  }
  const imgFrag = new ImageFragment(imageData)
  Object.assign(imgFrag, {
    ...defaultMeta,
    ...meta,
  })
  return imgFrag
}

export const createShape = (type, meta) => {
  const defaultMeta = {
    x: 0,
    y: 0,
  }
  const shape = new Shape(type)
  Object.assign(shape, {
    ...defaultMeta,
    ...meta,
  })
  return shape
}

const createCanvas = config => {
  const newCanvas = document.createElement('canvas')
  document.body.appendChild(newCanvas)
  newCanvas.setAttribute('class', config.class)
  // newCanvas.setAttribute('style', 'position: fixed; top: -999em;')
  return newCanvas
}

const offscreenCanvases = {
  shapeToImageFragment: createCanvas({ class: 'shapeToImageFragment' }),
  mergeImageFragments: createCanvas({ class: 'mergeImageFragments' }),
  getCanvasWithImageData: createCanvas({ class: 'getCanvasWithImageData' }),
  // imageDataToDataURL: createCanvas({ class: 'imageDataToDataURL' }),
}

/**
 * object
 * type: rect, x, y, width, height, color, stroke, radius?
 */
export const shapeToImageFragment = ({ type, x, y, ...rest }) => {
  const canvas = offscreenCanvases.shapeToImageFragment
  const ctx = canvas.getContext('2d')
  ctx.save()

  switch (type) {
    case 'rect': {
      const { width, height, color /*stroke*/ } = rest
      canvas.width = width
      canvas.height = height
      ctx.fillStyle = color
      ctx.fillRect(0, 0, width, height)
      break
    }

    default:
      throw new Error(`Unknown type ${type}`)
  }
  ctx.restore()
  if (canvas.width === 0 || canvas.height === 0) {
    return null
  }
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  return createImageFragment(imageData, { x, y })
}

// export const imageDataToDataURL = imageData => {
//   const canvas = offscreenCanvases.imageDataToDataURL
//   const ctx = canvas.getContext('2d')
//   ctx.putImageData(imageData, 0, 0)
//   return canvas.toDataURL('image/png')
// }

const getCanvasWithImageData = imageData => {
  const canvas = offscreenCanvases.getCanvasWithImageData
  const ctx = canvas.getContext('2d')
  canvas.width = imageData.width
  canvas.height = imageData.height
  ctx.putImageData(imageData, 0, 0)
  return canvas
}

export const mergeImageFragments = imageFragments => {
  console.time(`merging imageFragments ${imageFragments.length}`)
  const origin = [0, 0]
  const lastOrigin = [0, 0]
  const canvas = offscreenCanvases.mergeImageFragments
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  imageFragments.forEach(imgFrag => {
    if (!imgFrag || !imgFrag.imageData) {
      return
    }
    const { imageData, x, y } = imgFrag

    // calculate width, height & new origin
    const width =
      Math.max(canvas.width - origin[0], x + imageData.width) -
      Math.min(-origin[0], x)
    const height =
      Math.max(canvas.height - origin[1], y + imageData.height) -
      Math.min(-origin[1], y)
    if (x < -origin[0]) {
      lastOrigin[0] = origin[0]
      origin[0] = -x
    } else {
      lastOrigin[0] = origin[0]
    }
    if (y < -origin[1]) {
      lastOrigin[1] = origin[1]
      origin[1] = -y
    } else {
      lastOrigin[1] = origin[1]
    }

    // resize
    const prevImgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    canvas.width = width
    canvas.height = height
    ctx.putImageData(
      prevImgData,
      lastOrigin[0] === origin[0] ? 0 : origin[0] - lastOrigin[0],
      lastOrigin[1] === origin[1] ? 0 : origin[1] - lastOrigin[1]
    )
    ctx.translate(...origin)

    // draw
    ctx.drawImage(getCanvasWithImageData(imageData), x, y)
  })
  console.timeEnd(`merging imageFragments ${imageFragments.length}`)
  const result = ctx.getImageData(0, 0, canvas.width, canvas.height)
  return createImageFragment(result, {
    x: -origin[0],
    y: -origin[1],
  })
}
