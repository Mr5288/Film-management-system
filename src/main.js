import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import Qs from 'qs'
import dayjs from 'dayjs'
import arrayToTree from 'array-to-tree'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.Qs = Qs
Vue.prototype.dayjs = dayjs
Vue.prototype.arrayToTree = arrayToTree

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.1:3007/my'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')

  return config
})

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
