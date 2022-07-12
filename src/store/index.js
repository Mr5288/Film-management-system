import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: []// 用户信息
  },
  getters: {
  },
  mutations: {
    // 初始化用户信息
    initUserInfo (state, userInfo) {
      state.userInfo = userInfo
    }
  },
  actions: {
    // 获取用户信息
    getUserInfo (context) {
      axios.get('admininfo').then(({ data: res }) => {
        context.commit('initUserInfo', res.data)
      })
    }
  },
  modules: {
  }
})
