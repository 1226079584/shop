import Vue from 'vue'
import Router from 'vue-router'
// const Foo = () => import('./Foo.vue')
const login = () => import('@/components/login.vue')
const home = () => import('@/components/home.vue')
const user = () => import('@/components/user.vue')
const rights = () => import('@/components/rights.vue')
const roles = () => import('@/components/roleList.vue')
const goods = () => import('@/components/goods.vue')
const goodsadd = () => import('@/components/goodsadd.vue')
const params = () => import('@/components/params.vue')
const categories = () => import('@/components/categories.vue')
const orders = () => import('@/components/orders.vue')
const reports = () => import('@/components/reports.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: home,
      children: [{
        name: 'users',
        path: '/users',
        component: user
      },
      {
        name: 'rights',
        path: '/rights',
        component: rights
      },
      {
        name: 'roles',
        path: '/roles',
        component: roles
      },
      {
        name: 'goods',
        path: '/goods',
        component: goods
      },
      {
        name: 'goodsadd',
        path: '/goodsadd',
        component: goodsadd
      },
      {
        name: 'params',
        path: '/params',
        component: params
      },
      {
        name: 'categories',
        path: '/categories',
        component: categories
      },
      {
        name: 'orders',
        path: '/orders',
        component: orders
      },
      {
        name: 'reports',
        path: '/reports',
        component: reports
      }]
    },
    {
      name: 'login',
      path: '/login',
      component: login
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    next()
  } else {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push({ name: 'login' })
      return
    }
    next()
  }
})

export default router
