import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue'
import home from '@/components/home.vue'
import user from '@/components/user.vue'
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
      }]
    },
    {
      name: 'login',
      path: '/login',
      component: login}
  ]
})
