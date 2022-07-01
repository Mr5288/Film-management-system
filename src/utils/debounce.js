const debounce = function (fn, delay) {
  let timer = null
  return function () {
    const content = this
    const args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(content, args)
    }, delay)
  }
}
export default debounce
