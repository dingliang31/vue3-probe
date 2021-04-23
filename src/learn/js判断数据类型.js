/**
 * 基本数据类型: String Number Boolean Symbol Undefined Null
 * 引用类型: Object
 */

/**
 * 1. typeof 操作符, 返回右侧 表达式 的数据类型(全小写形式)。number boolean symbol string object undefined function
 * 基本数据类型 除null，都正确返回
 * 应用类型除 function 外，都返回object
 * null 有属于自己的 Null 类型， 数组、日期、正则有具体的类型。
 * typeof 只返回其处于原型链最订单的Object类型
 */ 
typeof '' // string
typeof 1 // number
typeof Symbol() // symbol
typeof true // boolean
// ...
typeof null // object
typeof [] // object
typeof new Function() // function
typeof new Date() // object
typeof new RegExp() // object

/**
 * 2. instanceof 用来判断 A 是否为 B 的实例。A instanceof B。instanceof 检测的是原型。instanceof 只能用来判断两个对象是否属于实例关系，而不能判断一个对象实例具体属于那种类型
 */
// instanceof 操作符的问题在于，它假定只有一个全局执行环境。如果网页中包含多个框架，那实际上就存在两个以上不同的全局执行环境，从而存在两个以上不同版本的构造函数。如果你从一个框架向另一个框架传入一个数组，那么传入的数组与在第二个框架中原生创建的数组分别具有各自不同的构造函数。
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
xArray = window.frames[0].Array;
var arr = new xArray(1,2,3); // [1,2,3]
arr instanceof Array;// false
// 针对数组的这个问题，ES5 提供了 Array.isArray() 方法 。该方法用以确认某个对象本身是否为 Array 类型，而不区分该对象在哪个环境中创建。
// Array.isArray() 本质上检测的是对象的 [[Class]] 值，[[Class]] 是对象的一个内部属性，里面包含了对象的类型信息，其格式为 [object Xxx] ，Xxx 就是对应的具体类型 。对于数组而言，[[Class]] 的值就是 [object Array]。

/**
 * 3. constructor 当一个函数 F被定义时，JS引擎会为F添加 prototype 原型，然后再在 prototype上添加一个 constructor 属性，并让其指向 F 的引用
 */
new Error().constructor === Error
window.constructor === Window
document.constructor === HTMLDocument
// 细节问题 ： 1. null 和 undefined 是无效的对象，因此是不会有 constructor 存在的，这两种类型的数据需要通过其他方式来判断。
//            2. 函数的 constructor 是不稳定的，这个主要体现在自定义对象上，当开发者重写 prototype 后，原有的 constructor 引用会丢失，constructor 会默认为 <Object> 
// todo 需要多重考证：F.prototype = undefined | null | new Date..., f = new F(),f.constructor

/**
 * 4. toString() 是 Object 的原型方法，调用该方法，默认返回当前对象的 [[Class]] 。这是一个内部属性，其格式为 [object Xxx] ，其中 Xxx 就是对象的类型。对于 Object 对象，直接调用 toString()  就能返回 [object Object] 。而对于其他对象，则需要通过 call / apply 来调用才能返回正确的类型信息。
 */
Object.prototype.toString.call('') // [object String]
Object.prototype.toString.call(Symbol()) // [object Symbol]
Object.prototype.toString.call(undefined) // [object Undefined]
Object.prototype.toString.call(null) // [object Null]
Object.prototype.toString.call(new Function()) // [object Function]
Object.prototype.toString.call(new Date()) // [object Date]
Object.prototype.toString.call(document) // [object HTMLDocument]
Object.prototype.toString.call(window) // [object global] window 是全局对象 global 的引用
