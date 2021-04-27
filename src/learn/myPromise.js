/**
 * 引题
 */
Promise.resolve().then(() => {
  console.log(0);
  return Promise.resolve(4);
}).then((res) => {
  console.log(res)
})

Promise.resolve().then(() => {
  console.log(1);
}).then(() => {
  console.log(2);
}).then(() => {
  console.log(3);
}).then(() => {
  console.log(5);
}).then(() =>{
  console.log(6);
})

// 打印结果 0、1、2、3、4、5、6

/**
 * Js 有两种任务的执行模式：同步模式（Synchronous）和异步模式（Asynchronous）。
 * 在异步模式下，创建异步任务主要分为宏任务与微任务两种。ES6 规范中，宏任务（Macrotask） 称为 Task， 微任务（Microtask） 称为 Jobs。宏任务是由宿主（浏览器、Node）发起的，而微任务由 JS 自身发起。
 */
// 宏任务：setTimeout, setInterval, MessageChannel, I/O 时间队列, setImmediate(Node 环境), script(整体代码块)
// 微任务：requestAnimationFrame(有争议), MutationObserver(浏览器环境), Promise.[then, catch, finally], process.nextTick(Node环境), queueMicrotack

/**
 * eventLoop  public/images/EventLoop.jpg
 * 判断宏任务队列是否为空
 * 不空 --> 执行最早进入队列的任务 --> 执行下一步
 * 空 --> 执行下一步
 * 判断微任务队列是否为空
 * 不空 --> 执行最早进入队列的任务 --> 继续检查微任务队列空不空
 * 空 --> 执行下一步
 */ 

// Promise A+ 规范: 检验一份手写 Promise 靠不靠谱，通过 Promise A+ 规范自然是基本要求，这里我们可以借助 promises-aplus-tests[3] 来检测我们的代码是否符合规范
/**
 * 基本原理
 * 1. Promise 是一个类，在执行这个类的时候会传入一个执行器，这个执行器会立即执行
 * 2. Promise 会有三种状态
 *  ·Pending 等待
 *  ·Fulfilled 完成
 *  ·Rejected 失败
 * 3. 状态只能由 Pending --> Fulfilled 或者 Pending --> Rejected，且一但发生改变便不可二次修改；
 * 4. Promise 中使用 resolve 和 reject 两个函数来更改状态；
 * 5. then 方法内部做但事情就是状态判断
 *  ·如果状态是成功，调用成功回调函数
 *  ·如果状态是失败，调用失败回调函数
 */
// 状态与结果的管理
// 先定义三个常量表示状态
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
class myPromise {
  // 储存状态的变量，初始值是 pending
  status = PENDING

  constructor(executor) {
    // executor是一个执行器，传入后会立即执行
    // 并传入 resolve 和 reject 方法 
    executor(this.resolve, this.reject)
  }
  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象

  // 成功之后的值
  value = null

  // 失败之后的原因
  reason = null

  // 更改成功后的状态
  resolve = (value) => {
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED
      // 保存成功之后的值
      this.value = value
    }
  }

  // 更改失败后的状态
  reject = (reason) => {
    // 只有状态是等待，才执行状态修改
    if (this.status === PENDING) {
      // 状态成功为失败
      this.status = REJECTED
      // 保存失败后的原因
      this.reason = reason
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    } else if (this.status === REJECTED) {
      onRejected(this.reason)
    }
  }
}

const pro = new myPromise((res, rej) => {
  res('success')
  rej('error')
})
pro.then(val => {
  console.log(val)
}, res => {
  console.log(res)
})

