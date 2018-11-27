import _ from 'lodash'

export const reverse = arr => {
  return arr.map((ele, idx) => {
    return arr[arr.length - 1 - idx]
  })
}

export const fallback = (chain, finalFallback) => {
  for (let i = 0; i < chain.length; i++) {
    if (chain[i]) {
      return [chain[i], i]
    }
  }
  return [finalFallback, -1]
}

export const calcDistance = (dot1, dot2) => {
  return Math.round(((dot1.x - dot2.x) ** 2 + (dot1.y - dot2.y) ** 2) ** 0.5)
}

export const interpolateDots = (dot1, dot2, span = 3) => {
  const dist = calcDistance(dot1, dot2)
  const count = Math.round(dist / span)
  const distX = dot2.x - dot1.x
  const stepX = distX / count
  const distY = dot2.y - dot1.y
  const stepY = distY / count
  const result = _.times(count, n => {
    return {
      x: dot1.x + n * stepX,
      y: dot1.y + n * stepY,
    }
  })
  return result
}
