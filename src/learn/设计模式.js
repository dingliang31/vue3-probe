/**
 * 1. 观察者模式：定义了对象间的一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知，并自动更新。观察者模式属于行为型模式，行为型模式关注的是对象之间的通讯，观察者模式就是观察者和被观察者之间的通讯。
 */
class Subject {
  constructor() {
    this.observers = []
  }

  add(observer) {
    this.observers.push(observer)
  }

  notify(...args) {
    this.observers.forEach(observer => observer.update && observer.update(...args))
  }
 }

 class Observer {
   update(...args) {
     console.log(...args)
   }
 }

 let ob1 = new Observer()
 let ob2 = new Array()
 let sub = new Subject()
 sub.add(ob1)
 sub.add(ob2)
 sub.notify('I fired `SMS` event')
/**
 * 2. 订阅-发布模式：称为发布者的消息发送者不会将消息直接发送给订阅者，这意味着发布者和订阅者不知道彼此的存在。在发布者和订阅者之间存在第三个组件，称为调度中心或事件通道，它维持着发布者和订阅者之间的联系，过滤所有发布者传入的消息并相应地分发它们给订阅者。
 */
class PubSub { // vue EventBus
  constructor() {
    this.subscribers = {}
  }

  subscribe(topic, callback) {
    this.subscribers[topic] = this.subscribers[topic] || []
    this.subscribers.push(callback)
  }

  publish(topic, ...args) {
    let callbacks = this.subscribers[topic] || []
    callbacks.forEach(callback => callback(...args))
  }
}