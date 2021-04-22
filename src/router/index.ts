import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
  Router,
  RouteLocationNormalized,
  NavigationGuardNext
} from 'vue-router';
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
