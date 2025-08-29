// 生产环境配置
const config = {
  // API基础URL
  baseURL: 'https://api.yourdomain.com',
  
  // 超时时间
  timeout: 10000,
  
  // 是否开启调试模式
  debug: false,
  
  // 微信小程序配置
  mpWeixin: {
    appId: 'your-production-wx-app-id'
  },
  
  // 支付宝小程序配置
  mpAlipay: {
    appId: 'your-production-alipay-app-id'
  }
}

export default config