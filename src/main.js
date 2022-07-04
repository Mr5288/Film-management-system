import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import Qs from 'qs'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.Qs = Qs
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.1:3007'
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
