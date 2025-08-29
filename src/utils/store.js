// 简单的全局状态管理替代方案
class SimpleStore {
  constructor() {
    this.state = {
      user: null,
      token: null,
      isLoggedIn: false
    }
    this.listeners = []
  }

  // 获取状态
  getState() {
    return this.state
  }

  // 设置状态
  setState(newState) {
    this.state = { ...this.state, ...newState }
    this.notify()
  }

  // 订阅状态变化
  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  // 通知所有订阅者
  notify() {
    this.listeners.forEach(listener => listener(this.state))
  }

  // 用户登录
  login(user, token) {
    this.setState({
      user,
      token,
      isLoggedIn: true
    })
  }

  // 用户登出
  logout() {
    this.setState({
      user: null,
      token: null,
      isLoggedIn: false
    })
  }
}

// 创建全局store实例
export const store = new SimpleStore()

// 提供useStore函数以保持API一致性
export function useStore() {
  return store
}