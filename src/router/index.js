import Vue from 'vue'
import VueRouter from 'vue-router'
import VueLogin from '../components/Vue-Login.vue'
import VueHome from '../components/Vue-Home.vue'
import VueIndex from '../components/Vue-HomeIndex.vue'
import VueUsers from '../components/user/Vue-Users.vue'
import VueAdmin from '../components/user/Vue-Admin.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: VueLogin },
  {
    path: '/home',
    component: VueHome,
    redirect: '/index',
    children: [
      { path: '/index', component: VueIndex },
      { path: '/userList', component: VueUsers },
      { path: '/adminList', component: VueAdmin }
    ]
  }
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
