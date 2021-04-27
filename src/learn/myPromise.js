/**
 * 引题
 */
// Promise.resolve().then(() => {
//   console.log(0);
//   return Promise.resolve(4);
// }).then((res) => {
//   console.log(res)
// })

// Promise.resolve().then(() => {
//   console.log(1);
// }).then(() => {
//   console.log(2);
// }).then(() => {
//   console.log(3);
// }).then(() => {
//   console.log(5);
// }).then(() =>{
//   console.log(6);
// })

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
class MyPromise {
  constructor(executor) {
    // executor 是一个执行器，进入会立即执行
    // 并传入resolve和reject方法
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      // 如果有错误，就直接执行 reject
      this.reject(error)
    }
  }

  // 储存状态的变量，初始值是 pending
  status = PENDING

  // 成功之后的值
  value = null

  // 失败之后的原因
  reason = null
  // 存储成功回调函数
  // onFulfilledCallback = null
  onFulfilledCallbacks = []
  // 存储失败回调函数
  // onRejectedCallback = null
  onRejectedCallbacks = []
  
  // resolve和reject为什么要用箭头函数？
  // 如果直接调用的话，普通函数this指向的是window或者undefined
  // 用箭头函数就可以让this指向当前实例对象

  // 更改成功后的状态
  resolve = (value) => {
    if (this.status === PENDING) {
      // 状态修改为成功
      this.status = FULFILLED
      // 保存成功之后的值
      this.value = value

      // 判断成功回调是否存在，如果存在就调用
      // this.onFulfilledCallbacks && this.onFulfilledCallbacks(value)

      // resolve里面将所有成功的回调拿出来执行
      while (this.onFulfilledCallbacks.length) {
        // Array.shift() 取出数组第一个元素，然后（）调用，shift不是纯函数，取出后，数组将失去该元素，直到数组为空
        this.onFulfilledCallbacks.shift()(value)
      }
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

      // 判断失败回调是否存在，如果存在就调用
      // this.onRejectedCallback && this.onRejectedCallback(reason)

      // resolve里面将所有失败的回调拿出来执行
      while (this.onRejectedCallbacks.length) {
        this.onRejectedCallbacks.shift()(reason)
      }
    }
  }

  then(onFulfilled, onRejected) {
    const realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
    const realOnRejected = typeof onRejected === 'function' ? onRejected : reason => { 
      throw reason
    }
    // 为了链式调用这里直接创建一个 MyPromise，并在后面 return 出去
    const promise2 = new MyPromise((resolve, reject) => {
      const fulfilledMicrotask = () =>  {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 获取成功回调函数的执行结果
            const x = realOnFulfilled(this.value);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          }
        })
      }
      const rejectedMicrotask = () => {
        // 创建一个微任务等待 promise2 完成初始化
        queueMicrotask(() => {
          try {
            // 调用失败回调，并且把原因返回
            const x = realOnRejected(this.reason);
            // 传入 resolvePromise 集中处理
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error)
          }
        })
      }
      // 判断状态
      if (this.status === FULFILLED) {
        fulfilledMicrotask()
      } else if (this.status === REJECTED) {
        rejectedMicrotask()
      } else if (this.status === PENDING) {
        // 等待
        // 因为不知道后面状态的变化情况，所以将成功回调和失败回调存储起来
        // 等到执行成功失败函数的时候再传递
        this.onFulfilledCallbacks.push(fulfilledMicrotask);
        this.onRejectedCallbacks.push(rejectedMicrotask);
      }
    })
    return promise2

    // if (this.status === FULFILLED) {
    //   onFulfilled(this.value)
    // } else if (this.status === REJECTED) {
    //   onRejected(this.reason)
    // } else if (this.status === PENDING) {
    //   // 因为不知道后面状态的变化，这里先将成功回调和失败回调存储起来
    //   // 等待后续调用
    //   this.onFulfilledCallback.push(onFulfilled)
    //   this.onRejectedCallback.push(onRejected)
    // }
  }
  // 静态方法
  static resolve(parameter) {
    // 如果传入的是 MyPromise 就直接返回
    if (parameter instanceof MyPromise) {
      return parameter
    }
    return new MyPromise((resolve) => {
      resolve(parameter)
    })
  }
  static reject (reason) {
    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }
}
function resolvePromise(promise, x, resolve, reject) {
  // 如果相等了，说明return的是自己，抛出类型错误并返回
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
  }
  if(typeof x === 'object' || typeof x === 'function') {
    if (x === null) {
      return resolve(x)
    }
    let then
    try {
      // 把 x.then 赋值给 then
      then = x.then
    } catch (error) {
      return reject(error)
    }
    // 如果 then 是函数
    if (typeof then === 'function') {
      let called = false
      try {
        then.call(
          x, // this 指向 x
          // 如果 resolvePromise 以值 y 为参数被调用，则运行[[Resolve]](promise, y "[Resolve]")
          y => {
            // 如果 resolvePromise 和 rejectPromise 均被调用，
            // 或者被同一个参数调用了多次，则优先采用首次调用并忽略剩下的调用
            // 实现这条需要前面加一个变量 called
            if (called) return 
            called = true
            resolvePromise(promise, y, resolve, reject)
          },
          // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
          r => {
            if (called) return
            called = true
            reject(r)
          }
        )
      } catch (error) {
        // 如果调用 then 方法抛出了异常 error：
        // 如果 resolvePromise 或 rejectPromise 已经被调用，直接返回
        if (called) return
        // 否则以 error 为据因拒绝 promise
        reject(error)
      }
    } else {
      // 如果 then 不是函数，以 x 为参数执行 promise
      resolve(x);
    }
  } else {
    // 如果 x 不为对象或者函数，以 x 为参数执行 promise
    resolve(x);
  }

  // 判断x是不是 MyPromise 实例对象
  // if(x instanceof MyPromise) {
  //   // 执行 x，调用 then 方法，目的是将其状态变为 fulfilled 或者 rejected
  //   // x.then(value => resolve(value), reason => reject(reason))
  //   // 简化之后
  //   x.then(resolve, reject)
  // } else{
  //   // 普通值
  //   resolve(x)
  // }
}
// window.MyPromise = MyPromise
MyPromise.resolve().then(() => {
  console.log(0);
  return MyPromise.resolve(4);
}).then((res) => {
  console.log(res)
})

MyPromise.resolve().then(() => {
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