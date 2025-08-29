// uCharts v2.0.0
// 这是一个简化版的uCharts实现，实际项目中应该使用完整的uCharts库

class uCharts {
  constructor(opts) {
    this.opts = opts
    this.context = uni.createCanvasContext(opts.canvasId, opts.$this)
    this.draw()
  }
  
  draw() {
    const { type, categories, series, width, height } = this.opts
    
    switch(type) {
      case 'pie':
        this.drawPie()
        break
      case 'column':
        this.drawColumn()
        break
      case 'line':
        this.drawLine()
        break
      default:
        this.drawColumn()
    }
  }
  
  drawPie() {
    const { series, width, height } = this.opts
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 3
    
    let startAngle = 0
    const total = series[0].data.reduce((sum, item) => sum + item.value, 0)
    
    series[0].data.forEach((item, index) => {
      const angle = (item.value / total) * 2 * Math.PI
      const endAngle = startAngle + angle
      
      this.context.beginPath()
      this.context.moveTo(centerX, centerY)
      this.context.arc(centerX, centerY, radius, startAngle, endAngle)
      this.context.closePath()
      
      const colors = ['#007aff', '#19be6b', '#ff9900', '#fa3534']
      this.context.setFillStyle(colors[index % colors.length])
      this.context.fill()
      
      // 绘制标签
      const labelX = centerX + Math.cos(startAngle + angle / 2) * (radius + 20)
      const labelY = centerY + Math.sin(startAngle + angle / 2) * (radius + 20)
      
      this.context.setFontSize(12)
      this.context.setFillStyle('#333')
      this.context.fillText(item.name, labelX - 20, labelY)
      this.context.fillText(`${item.value}`, labelX - 20, labelY + 15)
      
      startAngle = endAngle
    })
    
    this.context.draw()
  }
  
  drawColumn() {
    const { categories, series, width, height } = this.opts
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    const barWidth = chartWidth / (categories.length * series.length + categories.length - 1) * 0.8
    
    // 绘制坐标轴
    this.context.beginPath()
    this.context.moveTo(padding, padding)
    this.context.lineTo(padding, height - padding)
    this.context.lineTo(width - padding, height - padding)
    this.context.setStrokeStyle('#ccc')
    this.context.stroke()
    
    // 绘制柱子
    const maxValue = Math.max(...series[0].data)
    series.forEach((s, seriesIndex) => {
      s.data.forEach((value, index) => {
        const x = padding + (index * (barWidth + 10)) + 10
        const barHeight = (value / maxValue) * (chartHeight - 40)
        const y = height - padding - barHeight
        
        this.context.setFillStyle('#007aff')
        this.context.fillRect(x, y, barWidth, barHeight)
        
        // 绘制数值
        this.context.setFontSize(12)
        this.context.setFillStyle('#333')
        this.context.fillText(value.toString(), x + barWidth / 2 - 5, y - 5)
      })
    })
    
    // 绘制类别标签
    categories.forEach((category, index) => {
      const x = padding + (index * (barWidth + 10)) + 10 + barWidth / 2
      this.context.setFontSize(12)
      this.context.setFillStyle('#333')
      this.context.fillText(category, x - 15, height - padding + 15)
    })
    
    this.context.draw()
  }
  
  drawLine() {
    const { categories, series, width, height } = this.opts
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2
    
    // 绘制坐标轴
    this.context.beginPath()
    this.context.moveTo(padding, padding)
    this.context.lineTo(padding, height - padding)
    this.context.lineTo(width - padding, height - padding)
    this.context.setStrokeStyle('#ccc')
    this.context.stroke()
    
    // 绘制折线
    series.forEach((s, seriesIndex) => {
      const maxValue = Math.max(...s.data)
      const colors = ['#007aff', '#19be6b', '#ff9900', '#fa3534']
      
      this.context.beginPath()
      this.context.setStrokeStyle(colors[seriesIndex % colors.length])
      this.context.setLineWidth(2)
      
      s.data.forEach((value, index) => {
        const x = padding + (index * chartWidth / (categories.length - 1))
        const y = height - padding - (value / maxValue) * (chartHeight - 40)
        
        if (index === 0) {
          this.context.moveTo(x, y)
        } else {
          this.context.lineTo(x, y)
        }
        
        // 绘制数据点
        this.context.beginPath()
        this.context.arc(x, y, 4, 0, 2 * Math.PI)
        this.context.setFillStyle(colors[seriesIndex % colors.length])
        this.context.fill()
        
        // 绘制数值
        this.context.setFontSize(12)
        this.context.setFillStyle('#333')
        this.context.fillText(value.toString(), x - 5, y - 10)
      })
      
      this.context.stroke()
    })
    
    // 绘制类别标签
    categories.forEach((category, index) => {
      const x = padding + (index * chartWidth / (categories.length - 1))
      this.context.setFontSize(12)
      this.context.setFillStyle('#333')
      this.context.fillText(category, x - 15, height - padding + 15)
    })
    
    this.context.draw()
  }
  
  touchStart(e) {
    // 触摸事件处理
  }
  
  touchMove(e) {
    // 触摸事件处理
  }
  
  touchEnd(e) {
    // 触摸事件处理
  }
}

export default uCharts