// uview-plus配置文件
export default {
  // 主题色
  color: {
    primary: '#007aff',
    success: '#19be6b',
    warning: '#ff9900',
    error: '#fa3534',
    info: '#909399'
  },
  
  // 单位
  unit: 'rpx',
  
  // 组件配置
  components: {
    // 全局组件配置
    'u-button': {
      type: 'primary',
      size: 'normal'
    },
    'u-input': {
      border: 'surround',
      clearable: true
    },
    'u-form': {
      labelPosition: 'left',
      labelWidth: 'auto'
    }
  }
}
