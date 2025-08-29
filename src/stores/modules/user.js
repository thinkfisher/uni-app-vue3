import { defineStore } from 'pinia'
import { getUserInfo, login, wechatLogin, logout } from '@/api/auth'
import { setToken, getToken, removeToken } from '@/utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken() || '',
    userInfo: null,
    isLogin: false
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    userAvatar: (state) => state.userInfo?.avatar || '/static/default-avatar.png',
    userName: (state) => state.userInfo?.nickname || '游客'
  },
  
  actions: {
    // 登录
    async login(userInfo) {
      try {
        const { data } = await login(userInfo)
        this.token = data.token
        this.userInfo = data.user
        this.isLogin = true
        setToken(data.token)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 微信登录
    async wechatLogin(code) {
      try {
        const { data } = await wechatLogin({ code })
        this.token = data.token
        this.userInfo = data.user
        this.isLogin = true
        setToken(data.token)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 获取用户信息
    async getUserInfo() {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 退出登录
    async logout() {
      try {
        await logout()
        this.token = ''
        this.userInfo = null
        this.isLogin = false
        removeToken()
        uni.reLaunch({ url: '/pages/login/login' })
      } catch (error) {
        console.error('退出登录失败:', error)
      }
    },
    
    // 清除用户信息
    clearUserInfo() {
      this.token = ''
      this.userInfo = null
      this.isLogin = false
      removeToken()
    }
  }
})