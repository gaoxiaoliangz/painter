export const reverse = arr => {
  return arr.map((ele, idx) => {
    return arr[arr.length - 1 - idx]
  })
}
