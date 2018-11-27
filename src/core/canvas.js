// import _ from 'lodash'

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

// imageFragment 的 x, y 是其左上角的坐标
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

// shape 的 x, y 会根据 type 的不同而不同，
// rect 是左上角，cycle 是圆心坐标
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
  let canvasesWrap = document.getElementById('canvases-wrap')
  if (!canvasesWrap) {
    canvasesWrap = document.createElement('div')
    canvasesWrap.id = 'canvases-wrap'
    canvasesWrap.style = `
      position: fixed;
      left: 0;
      top: -999em;
      width: 0;
      height: 0;
      overflow: hidden;
      // margin-top: 500px;
    `
    document.body.appendChild(canvasesWrap)
  }
  const canvas = document.createElement('canvas')
  const title = document.createElement('p')
  canvas.width = 1
  canvas.height = 1
  title.textContent = config.class
  const wrap = document.createElement('div')
  wrap.appendChild(title)
  wrap.appendChild(canvas)
  canvasesWrap.appendChild(wrap)
  canvas.setAttribute('class', config.class)
  // newCanvas.setAttribute('style', 'position: fixed; top: -999em; background: gray')
  canvas.setAttribute('style', 'background: gray')
  return canvas
}

const offscreenCanvases = {
  shapeToImageFragment: createCanvas({ class: 'shapeToImageFragment' }),
  mergeImageFragments: createCanvas({ class: 'mergeImageFragments' }),
  getCanvasWithImageData: createCanvas({ class: 'getCanvasWithImageData' }),
  imageDataToDataURL: createCanvas({ class: 'imageDataToDataURL' }),
}

/**
 * object
 * types
 * rect: x, y, width, height, color, stroke?, radius?
 * cycle: x, y, r, color
 * fragment 的 x, y 永远都是左上角的坐标
 */
export const shapeToImageFragment = ({ type, x, y, ...rest }) => {
  const canvas = offscreenCanvases.shapeToImageFragment
  const ctx = canvas.getContext('2d')
  let fragX = x
  let fragY = y
  ctx.save()

  switch (type) {
    case 'rect': {
      const { width, height, color /*stroke*/ } = rest
      canvas.width = Math.abs(width)
      canvas.height = Math.abs(height)
      ctx.fillStyle = color
      if (width < 0) {
        fragX = x + width
      }
      if (height < 0) {
        fragY = y + height
      }
      // @todo: 会不会有问题？
      ctx.fillRect(0, 0, Math.abs(width), Math.abs(height))
      break
    }

    case 'cycle': {
      const { r, color } = rest
      canvas.width = 2 * r
      canvas.height = 2 * r
      ctx.beginPath()
      ctx.fillStyle = color
      ctx.arc(r, r, r, 0, Math.PI * 2)
      ctx.fill()
      fragX = x - r
      fragY = y - r
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
  return createImageFragment(imageData, { x: fragX, y: fragY })
}

export const imageDataToDataURL = imageData => {
  const canvas = offscreenCanvases.imageDataToDataURL
  const ctx = canvas.getContext('2d')
  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL('image/png')
}

const getCanvasWithImageData = imageData => {
  const canvas = offscreenCanvases.getCanvasWithImageData
  const ctx = canvas.getContext('2d')
  canvas.width = imageData.width
  canvas.height = imageData.height
  ctx.putImageData(imageData, 0, 0)
  return canvas
}

export const mergeImageFragmentsOld = imageFragments => {
  console.log('--- mergeImageFragments ---')
  console.time('mergeImageFragments')
  const startT = new Date().valueOf()
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
    console.time('calculate width, height & new origin')
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
    console.timeEnd('calculate width, height & new origin')

    // resize
    console.time('resize')
    console.time('getImageData')
    const prevImgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    console.timeEnd('getImageData')
    console.time('canvas mutation')
    canvas.width = width
    canvas.height = height
    console.timeEnd('canvas mutation')
    console.time('putImageData')
    ctx.putImageData(
      prevImgData,
      lastOrigin[0] === origin[0] ? 0 : origin[0] - lastOrigin[0],
      lastOrigin[1] === origin[1] ? 0 : origin[1] - lastOrigin[1]
    )
    console.timeEnd('putImageData')
    ctx.translate(...origin)
    console.timeEnd('resize')

    // draw
    console.time('draw')
    ctx.drawImage(getCanvasWithImageData(imageData), x, y)
    console.timeEnd('draw')
  })
  console.time('getImageData')
  const result = ctx.getImageData(0, 0, canvas.width, canvas.height)
  console.timeEnd('getImageData')
  const finalResult = createImageFragment(result, {
    x: -origin[0],
    y: -origin[1],
  })
  const span = new Date().valueOf() - startT
  if (span > 50) {
    console.warn(
      `merging imageFragments ${imageFragments.length} takes ${span}ms`
    )
  }
  console.timeEnd('mergeImageFragments')
  return finalResult
}

export const mergeImageFragments = imageFragments => {
  console.log(`--- mergeImageFragments new (${imageFragments.length}) ---`)
  console.time('mergeImageFragments')
  const startT = new Date().valueOf()
  const padding = { top: 50, right: 50, bottom: 50, left: 50 }
  const initialWidth = 500
  const initialHeight = 500
  const boundary = {
    width: 1,
    height: 1,
    loc: null,
  }
  const canvas = offscreenCanvases.mergeImageFragments
  canvas.width = initialWidth + padding.left + padding.right
  canvas.height = initialHeight + padding.top + padding.bottom
  const ctx = canvas.getContext('2d')
  ctx.translate(padding.left, padding.top)

  imageFragments.forEach(imgFrag => {
    if (!imgFrag || !imgFrag.imageData) {
      return
    }
    const { imageData, x, y } = imgFrag

    // calculate width, height & new origin
    console.time('calculate width, height & new origin')
    const width = Math.max(boundary.width, x + imageData.width) - Math.min(0, x)
    const height =
      Math.max(boundary.height, y + imageData.height) - Math.min(0, y)
    boundary.width = width
    boundary.height = height

    if (boundary.loc === null) {
      boundary.loc = {
        x,
        y,
      }
    } else {
      boundary.loc.x = Math.min(x, boundary.loc.x)
      boundary.loc.y = Math.min(y, boundary.loc.y)
    }

    console.timeEnd('calculate width, height & new origin')

    // resize
    // 当内容会溢出画布时，resize 画布，这是一个十分消耗性能的操作（具体来说 getImageData 不够快）
    // 所以一开始画布设置的较大以避免这种操作
    // if (boundary.loc.x < - padding.left || boundary.loc.y < -padding.top || boundary)

    // console.time('resize')
    // console.time('getImageData')
    // const prevImgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    // console.timeEnd('getImageData')
    // console.time('canvas mutation')
    // canvas.width = width
    // canvas.height = height
    // console.timeEnd('canvas mutation')
    // console.time('putImageData')
    // ctx.putImageData(
    //   prevImgData,
    //   lastOrigin[0] === origin[0] ? 0 : origin[0] - lastOrigin[0],
    //   lastOrigin[1] === origin[1] ? 0 : origin[1] - lastOrigin[1]
    // )
    // console.timeEnd('putImageData')
    // ctx.translate(...origin)
    // console.timeEnd('resize')

    // draw
    console.time('draw')
    ctx.drawImage(getCanvasWithImageData(imageData), x, y)
    console.timeEnd('draw')
  })
  if (boundary.loc === null) {
    return null
  }
  console.time('getImageData')
  const result = ctx.getImageData(
    boundary.loc.x + padding.left,
    boundary.loc.y + padding.top,
    boundary.width,
    boundary.height
  )
  const finalResult = createImageFragment(result, boundary.loc)
  console.timeEnd('getImageData')
  const span = new Date().valueOf() - startT
  if (span > 50) {
    console.warn(
      `merging imageFragments ${imageFragments.length} takes ${span}ms`
    )
  }
  console.timeEnd('mergeImageFragments')
  return finalResult
}
