import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  Router,
  RouteLocationNormalized,
  NavigationGuardNext
} from 'vue-router';
import Main from '../views/Main/index.vue'
import Login from '../views/Login/login.vue'
import Register from '../views/Login/register.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  }, {
    path: '/login',
    name: 'Login',
    component: Login
  }, {
    path: '/register',
    name: 'Register',
    component: Register
  }, {
    path: '/main',
    name: 'Main',
    component: Main
  }, {
    path: '/map',
    name: 'Map',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Map/Map.vue')
  }, {
    path: '/amap',
    name: 'MapChart',
    component: () => import(/* webpackChunkName: "amap" */ '../views/Map/MapChart.vue')
  }, {
    path: '/directive',
    name: 'Directive',
    component: () => import(/* webpackChunkName: "directive" */ '../views/Directive/index.vue')
  }, {
    path: '/table',
    name: 'Table',
    component: () => import(/* webpackChunkName: "table" */ '../views/Table/index.vue')
  },
  {
    path: '/:error*',
    name: 'ErrorPage',
    component: () => import(/* webpackChunkName: "errorPage" */ '../views/ErrorPage/index.vue')
  }
]

const router: Router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// @ts-ignore
router.beforeEach((this: T, to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext): void => {
  console.log(this, to, from, next)
  next()
})

export default router
