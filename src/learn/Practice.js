const obj = {
    name: 'xiaoming',
    age: 24,
    ol: {
        a: 'asdmalskjdl'
    }
}
const handler = {
    set(target, name, value, receiver) {
        console.log('set', target, name, value, receiver, arguments)
        target[name] = value
    },
    get(target, name, receiver) {
        console.log('get', target, name, receiver)
        return target[name]
    }
}
const proxy = new Proxy(obj, handler)
proxy.ol.a = '123123'
proxy.ol.a
// console.log(proxy)