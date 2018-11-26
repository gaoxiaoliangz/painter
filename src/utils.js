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
