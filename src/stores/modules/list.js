import { defineStore } from 'pinia'
import { getList, getListDetail, createListItem, updateListItem, deleteListItem } from '@/api/list'

export const useListStore = defineStore('list', {
  state: () => ({
    list: [],
    total: 0,
    loading: false,
    refreshing: false,
    hasMore: true,
    query: {
      page: 1,
      pageSize: 10,
      keyword: '',
      status: '',
      sort: 'createdAt_desc'
    }
  }),
  
  getters: {
    // 获取列表数据
    getListData: (state) => state.list,
    
    // 是否还有更多数据
    hasMoreData: (state) => state.hasMore && !state.loading,
    
    // 获取加载状态
    isLoading: (state) => state.loading,
    
    // 获取刷新状态
    isRefreshing: (state) => state.refreshing
  },
  
  actions: {
    // 获取列表数据
    async fetchList(params = {}) {
      this.loading = true
      try {
        const query = { ...this.query, ...params }
        const { data } = await getList(query)
        
        if (query.page === 1) {
          this.list = data.list
        } else {
          this.list = [...this.list, ...data.list]
        }
        
        this.total = data.total
        this.hasMore = this.list.length < this.total
        this.query = query
        
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      } finally {
        this.loading = false
        this.refreshing = false
      }
    },
    
    // 刷新列表
    async refreshList() {
      this.refreshing = true
      this.query.page = 1
      this.hasMore = true
      await this.fetchList()
    },
    
    // 加载更多
    async loadMore() {
      if (this.hasMore && !this.loading) {
        this.query.page += 1
        await this.fetchList()
      }
    },
    
    // 搜索列表
    async searchList(keyword) {
      this.query.keyword = keyword
      this.query.page = 1
      await this.fetchList()
    },
    
    // 筛选列表
    async filterList(filters) {
      this.query = { ...this.query, ...filters, page: 1 }
      this.hasMore = true
      await this.fetchList()
    },
    
    // 获取详情
    async getDetail(id) {
      try {
        const { data } = await getListDetail(id)
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 创建列表项
    async createItem(item) {
      try {
        const { data } = await createListItem(item)
        this.list.unshift(data)
        this.total += 1
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 更新列表项
    async updateItem(id, item) {
      try {
        const { data } = await updateListItem(id, item)
        const index = this.list.findIndex(i => i.id === id)
        if (index !== -1) {
          this.list[index] = { ...this.list[index], ...data }
        }
        return Promise.resolve(data)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 删除列表项
    async deleteItem(id) {
      try {
        await deleteListItem(id)
        const index = this.list.findIndex(i => i.id === id)
        if (index !== -1) {
          this.list.splice(index, 1)
          this.total -= 1
        }
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    // 重置查询条件
    resetQuery() {
      this.query = {
        page: 1,
        pageSize: 10,
        keyword: '',
        status: '',
        sort: 'createdAt_desc'
      }
      this.hasMore = true
    }
  }
})