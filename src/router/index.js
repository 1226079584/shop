import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue'
import home from '@/components/home.vue'
import user from '@/components/user.vue'
import rights from '@/components/rights.vue'
import roles from '@/components/roleList.vue'
import goods from '@/components/goods.vue'
import goodsadd from '@/components/goodsadd.vue'
import params from '@/components/params.vue'
import categories from '@/components/categories.vue'
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
