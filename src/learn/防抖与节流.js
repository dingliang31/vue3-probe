// 防抖(Debounce) 定义：当持续触发事件时，一定时间段内没有再触发事件，事件处理函数才会执行一次，如果设定的时间到来之前，又一次触发了事件，就重新开始计时。
function debounce (fn, wait) {
  let timer = null
  return function (){
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      timer = setTimeout(() => {
          fn()
      }, wait)
  }
}
// 节流(Throttle) 定义：当持续触发事件时，保证一定时间段内只调用一次事件处理函数
const Throttle = (fn, delay) => {
  let preTime = Date.now()
  // 因为要保存上一次执行的时间，所以需要一个闭包
  return function () {
      const now = Date.now()
      if (now - preTime >= delay) {
          fn()
          preTime = Date.now()
      }
  }
}