import Vue from 'vue'
import VueRouter from 'vue-router'
import VueLogin from '@/components/Vue-Login.vue'
import VueHome from '@/components/Vue-Home.vue'
import VueIndex from '@/components/Vue-HomeIndex.vue'
import VueUsers from '@/components/user/Vue-Users.vue'
import VueAdmin from '@/components/user/Vue-Admin.vue'
import VueRoles from '@/components/power/Vue-Roles.vue'
import VueMovie from '@/components/movie/Vue-Movie.vue'
import VueMovieOrder from '@/components/order/Vue-MovieOrder.vue'
import VueFoodOrder from '@/components/order/Vue-FoodOrder.vue'
import VueOne from '@/components/cinema/Vue-One.vue'
import VueTwo from '@/components/cinema/Vue-Two.vue'
import VueThree from '@/components/cinema/Vue-Three.vue'
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
      { path: '/userlist', component: VueUsers },
      { path: '/adminlist', component: VueAdmin },
      { path: '/roleslist', component: VueRoles },
      { path: '/movielist', component: VueMovie },
      { path: '/movieorder', component: VueMovieOrder },
      { path: '/foodorder', component: VueFoodOrder },
      { path: '/hallone', component: VueOne },
      { path: '/halltwo', component: VueTwo },
      { path: '/hallthree', component: VueThree }
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
