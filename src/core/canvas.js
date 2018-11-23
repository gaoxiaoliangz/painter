/* eslint-disable no-loop-func */
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
  return newCanvas
}

const offscreenCanvases = {
  objectToImageData: createCanvas({ class: 'objectToImageData' }),
  imageDataToDataURL: createCanvas({ class: 'imageDataToDataURL' }),
  mergeImageData: createCanvas({ class: 'mergeImageData' }),
  bufferCanvas: createCanvas({ class: 'bufferCanvas' }),
}

// @todo: config
// const createCanvas = (config = defaultCanvasConfig, useNew = false) => {
//   let newCanvas
//   let newCtx
//   if (!canvas || useNew) {
//     newCanvas = document.createElement('canvas')
//     newCanvas.width = config.width
//     newCanvas.height = config.height
//     document.body.appendChild(newCanvas)
//     newCtx = newCanvas.getContext('2d')
//     if (!useNew) {
//       canvas = newCanvas
//       ctx = newCtx
//     }
//     return newCanvas
//   }
//   return canvas
// }

/**
 * object
 * type: rect, x, y, width, height, color, stroke, radius?
 */
export const objectToImageData = ({ type, ...rest }, canvasConfig) => {
  // const canvasConfigWithDefaults = {
  //   ...defaultCanvasConfig,
  //   ...canvasConfig,
  // }
  // // ctx.clearRect(
  // //   0,
  // //   0,
  // //   canvasConfigWithDefaults.width,
  // //   canvasConfigWithDefaults.height
  // // )

  // createCanvas(canvasConfigWithDefaults)
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

// const fallback = (chain, finalFallback) => {
//   for (let i = 0; i < chain.length; i++) {
//     if (chain[i]) {
//       return [chain[i], i]
//     }
//   }
//   return [finalFallback, -1]
// }

// export const mergeImageData = (...imageDataArr) => {
//   const [head, headIdx] = fallback(imageDataArr)
//   if (!head) {
//     return null
//   }
//   const newData = head.data.map((val, idx) => {
//     return fallback(
//       imageDataArr
//         .slice(headIdx + 1)
//         .filter(Boolean)
//         .map(r => r.data[idx]),
//       val
//     )[0]
//   })
//   const newImgData = ctx.createImageData(canvas.width, canvas.height)
//   newImgData.data.set(newData)
//   return newImgData
// }

// const imageDataToDataURL = imageData => {
//   // if (!dataUrlCanvas) {
//   //   dataUrlCanvas = createCanvas(undefined, true)
//   // }
//   // console.log(imageData.data.filter(Boolean))
//   // console.log('---')
//   // const ctx = dataUrlCanvas.getContext('2d')

//   const canvas = offscreenCanvases.imageDataToDataURL
//   const ctx = canvas.getContext('2d')
//   ctx.putImageData(imageData, 0, 0)
//   return canvas.toDataURL('image/png')
// }

const getCanvasWithImageData = imageData => {
  const canvas = offscreenCanvases.bufferCanvas
  const ctx = canvas.getContext('2d')
  // ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.putImageData(imageData, 0, 0)
  return canvas
}

export const mergeImageData = (...imageDataArr) => {
  // createCanvas()
  const canvas = offscreenCanvases.mergeImageData
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  imageDataArr.forEach(imgData => {
    if (!imgData || imgData.data.filter(Boolean).length === 0) {
      return
    }
    // const img = new Image()

    // img.src = imageDataToDataURL(imgData)
    ctx.drawImage(getCanvasWithImageData(imgData), 0, 0)
    // console.log(img)
    // document.body.appendChild(img)
  })
  return ctx.getImageData(0, 0, canvas.width, canvas.height)
  // const [head, headIdx] = fallback(imageDataArr)
  // if (!head) {
  //   return null
  // }
  // const newData = head.data.map((val, idx) => {
  //   return fallback(
  //     imageDataArr
  //       .slice(headIdx + 1)
  //       .filter(Boolean)
  //       .map(r => r.data[idx]),
  //     val
  //   )[0]
  // })
  // const newImgData = ctx.createImageData(canvas.width, canvas.height)
  // newImgData.data.set(newData)
  // return newImgData
}
