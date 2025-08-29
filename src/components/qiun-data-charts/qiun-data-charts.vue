<template>
  <view class="qiun-charts">
    <canvas
      :canvas-id="canvasId"
      :id="canvasId"
      class="charts"
      :style="{ width: cWidth * pixelRatio + 'px', height: cHeight * pixelRatio + 'px', transform: 'scale(' + (1 / pixelRatio) + ')', transformOrigin: 'left top' }"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    ></canvas>
  </view>
</template>

<script>
import uCharts from '@/components/u-charts/u-charts.js'

let _self
let canvaObj = {}

export default {
  name: 'QiunDataCharts',
  props: {
    type: {
      type: String,
      default: 'column'
    },
    chartData: {
      type: Object,
      default() {
        return {}
      }
    },
    opts: {
      type: Object,
      default() {
        return {}
      }
    },
    canvasId: {
      type: String,
      default: 'uCanvas'
    },
    cWidth: {
      type: Number,
      default: 375
    },
    cHeight: {
      type: Number,
      default: 250
    },
    inScrollView: {
      type: Boolean,
      default: false
    },
    pageScrollTop: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pixelRatio: 1,
      cWidth: 375,
      cHeight: 250
    }
  },
  mounted() {
    _self = this
    this.pixelRatio = uni.getSystemInfoSync().pixelRatio
    this.cWidth = uni.upx2px(this.cWidth)
    this.cHeight = uni.upx2px(this.cHeight)
    this.showCharts()
  },
  methods: {
    showCharts() {
      canvaObj[this.canvasId] = new uCharts({
        $this: _self,
        canvasId: this.canvasId,
        type: this.type,
        fontSize: 11,
        padding: this.opts.padding || [15, 15, 0, 15],
        legend: this.opts.legend || {},
        background: this.opts.background || '#FFFFFF',
        pixelRatio: _self.pixelRatio,
        categories: this.chartData.categories || [],
        series: this.chartData.series || [],
        animation: true,
        width: _self.cWidth * _self.pixelRatio,
        height: _self.cHeight * _self.pixelRatio,
        dataLabel: this.opts.dataLabel !== false,
        dataPointShape: true,
        extra: this.opts.extra || {},
        xAxis: this.opts.xAxis || {
          disableGrid: false,
          type: 'grid',
          gridType: 'dash',
          itemCount: 5,
          boundaryGap: 'center'
        },
        yAxis: this.opts.yAxis || {
          data: [{ min: 0 }],
          showTitle: false
        }
      })
    },
    touchStart(e) {
      canvaObj[this.canvasId].touchStart(e)
    },
    touchMove(e) {
      canvaObj[this.canvasId].touchMove(e)
    },
    touchEnd(e) {
      canvaObj[this.canvasId].touchEnd(e)
    }
  }
}
</script>

<style scoped>
.qiun-charts {
  width: 100%;
  height: 100%;
}

.charts {
  width: 100%;
  height: 100%;
}
</style>