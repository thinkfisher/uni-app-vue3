import request from '@/utils/request.js'

// 获取列表数据
export function getList(params) {
  return request.get('/api/list', params)
}

// 获取列表详情
export function getListDetail(id) {
  return request.get(`/api/list/${id}`)
}

// 创建列表项
export function createListItem(data) {
  return request.post('/api/list', data)
}

// 更新列表项
export function updateListItem(id, data) {
  return request.put(`/api/list/${id}`, data)
}

// 删除列表项
export function deleteListItem(id) {
  return request.delete(`/api/list/${id}`)
}