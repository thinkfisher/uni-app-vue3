import request from '@/utils/request.js'

// 获取统计数据
export function getStatistics() {
  return request.get('/api/statistics')
}

// 获取图表数据
export function getChartData(type) {
  return request.get(`/api/statistics/chart/${type}`)
}

// 获取用户统计
export function getUserStatistics() {
  return request.get('/api/statistics/user')
}

// 获取订单统计
export function getOrderStatistics() {
  return request.get('/api/statistics/order')
}