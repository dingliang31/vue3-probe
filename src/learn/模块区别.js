/**
 * CommonJS 和 ES6 Module 区别  https://blog.csdn.net/xgangzai/article/details/106935104
 */
// qs: 为什么 ES6 Module export 基础数据类型的时候会有【引用类型】的效果？
// 在 ES6 之前，ECMAScript 并没有提供代码组织的方式，那时候通常是基于 IIFE 来实现“模块化”，随着 JavaScript 在前端大规模的应用，以及服务端 Javascript 的推动，原先浏览器端的模块规范不利于大规模应用。于是早期便有了 CommonJS 规范，其目标是为了定义模块，提供通用的模块组织方式。
/**
 * 模块定义和使用
 * 在 Commonjs 中，一个文件就是一个模块。定义一个模块导出通过 exports 或者 module.exports 挂载即可。
 *  exports.count = 1;
 * 导入一个模块也很简单，通过 require 对应模块拿到 exports 对象。
 *  const counter = require('./counter');
 *  console.log(counter.count);
 * CommonJS 的模块主要由原生模块 module 来实现，这个类上的一些属性对我们理解模块机制有很大帮助。
 * Module {
    id: '.', // 如果是 mainModule id 固定为 '.'，如果不是则为模块绝对路径
    exports: {}, // 模块最终 exports
    filename: '/absolute/path/to/entry.js', // 当前模块的绝对路径
    loaded: false, // 模块是否已加载完毕
    children: [], // 被该模块引用的模块
    parent: '', // 第一个引用该模块的模块
    paths: [ // 模块的搜索路径
     '/absolute/path/to/node_modules',
     '/absolute/path/node_modules',
     '/absolute/node_modules',
     '/node_modules'
    ]
  }
 */

/**
 * 在编写 CommonJS 模块的时候，我们会使用 require 来加载模块，使用 exports 来做模块输出，还有 module，__filename, __dirname 这些变量，不需要引入就能使用:
 * Node 在解析 JS 模块时，会先按文本读取内容，然后将模块内容进行包裹，在外层裹了一个 function，传入变量。再通过 vm.runInThisContext 将字符串转成 Function形成作用域，避免全局污染。
 * let wrap = function(script) {
      return Module.wrapper[0] + script + Module.wrapper[1];
   };
 
   const wrapper = [
     '(function (exports, require, module, __filename, __dirname) { ',
     '\n});'
  ];
 * 参数中的 module 是当前模块的的 module 实例（尽管这个时候模块代码还没编译执行），exports 是 module.exports 的别名，最终被 require 的时候是输出 module.exports 的值。require 最终调用的也是 Module._load 方法。__filename，__dirname 则分别是当前模块在系统中的绝对路径和当前文件夹路径
 */

/**
 * 模块的查找过程
 * 从 Y 路径运行 require(X)
	 1. 如果 X 是内置模块（比如 require('http'）)
		a. 返回该模块。
		b. 不再继续执行。
		2. 如果 X 是以 '/' 开头、
      a. 设置 Y 为 '/'
		3. 如果 X 是以 './' 或 '/' 或 '../' 开头
		a. 依次尝试加载文件，如果找到则不再执行
      - (Y + X)
      - (Y + X).js
      - (Y + X).json
      - (Y + X).node
		b. 依次尝试加载目录，如果找到则不再执行
      - (Y + X + package.json 中的 main 字段).js
      - (Y + X + package.json 中的 main 字段).json
      - (Y + X + package.json 中的 main 字段).node
		c. 抛出 "not found"
		4. 遍历 module paths 查找，如果找到则不再执行
		5. 抛出 "not found"
		模块查找过程会将软链替换为系统中的真实路径，例如 lib/foo/node_moduels/bar 软链到 lib/bar，bar 包中又 require('quux')，最终运行 foo module 时，require('quux') 的查找路径是 lib/bar/node_moduels/quux 而不是 lib/foo/node_moduels/quux
	*/
