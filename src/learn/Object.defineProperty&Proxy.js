/**
 * Object.defineProperty() 的问题主要有三个：
 *  不能监听数组的变化
 *  必须遍历对象的每个属性
 *  必须深层遍历嵌套的对象
 * Object.defineProperty(obj, prop, descripter)
 *  obj: 要在其上定义属性的对象
 *  prop: 要定义或修改的属性名称
 *  descripter: 将被定义或修改的属性描述符
 */
const aryMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
const arrayAugmentations = [];
aryMethods.forEach((method)=> {
  // 这里是原生 Array 的原型方法
  let original = Array.prototype[method];
  // 将 push, pop 等封装好的方法定义在对象 arrayAugmentations 的属性上
  // 注意：是实例属性而非原型属性
  arrayAugmentations[method] = function () {
    console.log('我被改变啦!');
    // 调用对应的原生方法并返回结果
    return original.apply(this, arguments);
  };
});
let list = ['a', 'b', 'c'];
// 将我们要监听的数组的原型指针指向上面定义的空数组对象
// 这样就能在调用 push, pop 这些方法时走进我们刚定义的方法，多了一句 console.log
list.__proto__ = arrayAugmentations;
list.push('d');  // 我被改变啦！
// 这个 list2 是个普通的数组，所以调用 push 不会走到我们的方法里面。
let list2 = ['a', 'b', 'c'];
list2.push('d');  // 不输出内容
// 结合 Object.keys() 使用
Object.keys(obj).forEach(key => {
	Object.defineProperty(obj, key, {
		// ...
	})
})

/**
 * Proxy 对象用于定义基本操作的自定义行为（如属性查找，赋值，枚举，函数调用等）
 * 针对对象: 针对整个对象,而不是对象的某个属性
 * 支持数组: 不需要对数组的方法进行重载，省去了众多 hack
 * 嵌套支持: get 里面递归调用 Proxy 并返回
 * 
 */
  

