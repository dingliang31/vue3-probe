// 获取页面有多少中元素类型
new Set([...document.getElementsByTagName('*')].map((it) => it.nodeName)).size