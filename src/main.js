// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import elementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import breadcrumb from './components/breadcrumb.vue'
import '@/assets/css/base.css'
// import axios from 'axios'
import moment from 'moment'
import httphead from './components/http.js'
// axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

Vue.config.productionTip = false

Vue.use(httphead)
Vue.use(elementUi)

// Vue.prototype.$axios = axios
Vue.filter('fmdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
Vue.component('breadcrumb', breadcrumb)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
