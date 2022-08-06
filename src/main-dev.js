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
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import * as echarts from 'echarts'
Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.Qs = Qs
Vue.prototype.dayjs = dayjs
Vue.prototype.arrayToTree = arrayToTree
Vue.prototype.echarts = echarts

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.1:3007/my'

// 在request拦截器中展示进度条
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start()
  return config
})
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
