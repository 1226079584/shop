import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login.vue'
import home from '@/components/home.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: login
    },
    {
      name: 'home',
      path: '/home',
      component: home
    }
  ]
})
