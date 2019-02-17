import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue'
import home from '@/components/home.vue'
import user from '@/components/user.vue'
import rights from '@/components/rights.vue'
import roleList from '@/components/roleList.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: home,
      children: [{
        name: 'user',
        path: '/user',
        component: user
      },
      {
        name: 'rights',
        path: '/rights',
        component: rights
      },
      {
        name: 'roleList',
        path: '/roleList',
        component: roleList
      }]
    },
    {
      name: 'login',
      path: '/login',
      component: login}
  ]
})
