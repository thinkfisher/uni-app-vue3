import { getToken } from './auth.js'

// 创建请求实例
const http = uni.$u.http

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 加密密码
    if (config.data && config.data.password) {
      config.data.password = uni.$u.encrypt(config.data.password)
    }
    
    // 添加token
    const token = getToken()
    if (token) {
      config.header = config.header || {}
      config.header.Authorization = `Bearer ${token}`
    }
    
    // 添加基础URL
    config.baseURL = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3001' 
      : 'https://api.example.com'
    
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    const { data } = response
    if (data.code === 200) {
      return data.data
    } else {
      uni.$u.toast(data.message || '请求失败')
      return Promise.reject(new Error(data.message || '请求失败'))
    }
  },
  error => {
    if (error.statusCode === 401) {
      uni.$u.toast('登录已过期，请重新登录')
      uni.navigateTo({ url: '/pages/login/login' })
    } else {
      uni.$u.toast(error.errMsg || '网络错误')
    }
    return Promise.reject(error)
  }
)

// 封装常用请求方法
export default {
  get: (url, params = {}) => http.get(url, { params }),
  post: (url, data = {}) => http.post(url, data),
  put: (url, data = {}) => http.put(url, data),
  delete: (url, data = {}) => http.delete(url, { data })
}