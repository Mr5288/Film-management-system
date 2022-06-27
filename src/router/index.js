import Vue from 'vue'
import VueRouter from 'vue-router'
import VueLogin from '../components/Vue-Login.vue'
import VueHome from '../components/Vue-Home.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: VueLogin },
  { path: '/home', component: VueHome }
]

const router = new VueRouter({
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
