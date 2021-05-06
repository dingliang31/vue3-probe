/**
 * 1.实现一个静态install方法，因为作为插件都必须有这个方法，给Vue.use()去调用；
 * 2.可以监听路由变化；
 * 3.解析配置的路由，即解析router的配置项routes，能根据路由匹配到对应组件；
 * 4.实现两个全局组件router-link和router-view；（最终落地点）
 */
let Vue;
class KVueRouter {
		constructor(options){
				this.$options=options;
				this.$routerMap={};//{"/":{component:...}}
				// url 响应式，当值变化时引用的地方都会刷新
				this.app = new Vue({
						data:{
								current:"/"
						}
				});
		}
		// 初始化
		init(){
				// 监听事件
				this.bindEvent();
				// 解析路由
				this.createRouteMap();
				// 声明组件
				this.initComponent();
		}
		bindEvent(){
				window.addEventListener('hashchange',this.onHashchange.bind(this));
		}
		onHashchange(){
				this.app.current = window.location.hash.slice(1) || "/";
		}
		createRouteMap(){
				this.$options.routes.forEach(route=>{
						this.$routerMap[route.path]=route;
				})
		}
		initComponent(){
				Vue.component('router-link',{
						props:{
								to:String,
						},
						render(h){
								return h('a',{attrs:{href:'#'+this.to}},[this.$slots.default])
						}
				});
				Vue.component('router-view',{
						render:(h)=>{
								const Component = this.$routerMap[this.app.current].component;
								return h(Component)
						}
				});
		}
}
// 参数是vue构造函数，Vue.use(router)时,执行router的install方法并把Vue作为参数传入
KVueRouter.install = function(_vue){
		Vue = _vue;
		//全局混入
		Vue.mixin({
				beforeCreate(){//拿到router的示例，挂载到vue的原型上
						if (this.$options.router) {
								Vue.prototype.$router=this.$options.router;
								this.$options.router.init();
						}
				}
		})
}
export default KVueRouter;
// Vue.use(Router)时，会调用router的install方法并把Vue类传入，混入beforeCreate方法，即在Vue实例化后挂载前在vue原型上挂个$router方法(因为这样后面才能用this.$router.push()...但此处没有实现哦)，然后调用router实例的init方法；
// 在init中把三件事情都干了，监听路由，解析路由（路由mapping匹配），定义组件；

// 需要注意的是，存储当前路由的变量this.app.current非一般的变量，而是借用Vue的响应式定义的，所以当路由变化时只需要给这个this.app.current赋值，而router-view组件刚好引用到这个值，当其改变时所有的引用到的地方都会改变，则得到的要展示的组件也就响应式的变化了。
