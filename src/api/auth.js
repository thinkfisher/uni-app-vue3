import request from '@/utils/request.js'

// 用户登录
export function login(data) {
  return request.post('/api/auth/login', data)
}

// 用户注册
export function register(data) {
  return request.post('/api/auth/register', data)
}

// 微信登录
export function wxLogin(code) {
  return request.post('/api/auth/wx-login', { code })
}

// 获取用户信息
export function getUserInfo() {
  return request.get('/api/user/info')
}

// 更新用户信息
export function updateUserInfo(data) {
  return request.put('/api/user/info', data)
}

// 退出登录
export function logout() {
  return request.post('/api/auth/logout')
}