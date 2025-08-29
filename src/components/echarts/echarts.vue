<template>
  <view class="echarts-container">
    <canvas
      :id="canvasId"
      :canvas-id="canvasId"
      class="echarts-canvas"
      :style="{ width: width + 'px', height: height + 'px' }"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    ></canvas>
  </view>
</template>

<script>
import * as echarts from 'echarts';
import { onMounted, onBeforeUnmount, watch, ref } from 'vue';

export default {
  name: 'ECharts',
  props: {
    canvasId: {
      type: String,
      default: 'echarts'
    },
    width: {
      type: Number,
      default: 375
    },
    height: {
      type: Number,
      default: 250
    },
    option: {
      type: Object,
      required: true
    },
    disableTouch: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    let chart = null;
    const pixelRatio = ref(uni.getSystemInfoSync().pixelRatio);
    const canvasNode = ref(null);
    
    // 初始化图表
    const initChart = () => {
      // 延迟获取canvas上下文
      setTimeout(() => {
        // 使用不同的方法获取canvas上下文，适配不同平台
        const query = uni.createSelectorQuery();
        query
          .select(`#${props.canvasId}`)
          .fields({ node: true, size: true, context: true })
          .exec((res) => {
            if (res[0]) {
              // 获取canvas上下文
              const canvas = res[0].node || res[0].context;
              if (!canvas) {
                console.error('无法获取canvas上下文');
                return;
              }
              
              // 初始化echarts实例 - 使用不同的初始化方法
              // #ifdef H5
              // 在 H5 环境下，需要获取真实的 DOM 元素
              const chartDom = document.getElementById(props.canvasId);
              if (chartDom) {
                chart = echarts.init(chartDom, null, {
                  width: props.width,
                  height: props.height,
                  devicePixelRatio: pixelRatio.value
                });
              } else {
                console.error('无法获取图表DOM元素');
              }
              // #endif
              
              // #ifndef H5
              // 小程序环境下的初始化
              if (canvas.node) {
                const ctx = canvas.node.getContext('2d');
                canvas.node.width = props.width * pixelRatio.value;
                canvas.node.height = props.height * pixelRatio.value;
                ctx.scale(pixelRatio.value, pixelRatio.value);
                
                chart = echarts.init(canvas.node, null, {
                  width: props.width,
                  height: props.height,
                  devicePixelRatio: pixelRatio.value
                });
                canvas.node.setChart && canvas.node.setChart(chart);
              } else {
                // 兼容旧版本小程序
                const ctx = canvas.getContext('2d');
                chart = echarts.init(canvas, null, {
                  width: props.width,
                  height: props.height,
                  devicePixelRatio: pixelRatio.value
                });
              }
              // #endif
              
              // 设置图表配置
              if (chart) {
                chart.setOption(props.option);
                
                // 通知父组件图表已准备好
                emit('chartReady', chart);
              } else {
                console.error('图表初始化失败');
              }
            }
          });
      }, 100);
    };
    
    // 监听配置变化
    watch(() => props.option, (newVal) => {
      if (chart) {
        chart.setOption(newVal);
      }
    }, { deep: true });
    
    // 触摸事件处理
    const touchStart = (e) => {
      if (props.disableTouch || !chart) return;
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 0
      });
    };
    
    const touchMove = (e) => {
      if (props.disableTouch || !chart) return;
    };
    
    const touchEnd = (e) => {
      if (props.disableTouch || !chart) return;
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: 0
      });
    };
    
    // 组件挂载时初始化图表
    onMounted(() => {
      initChart();
    });
    
    // 组件卸载前销毁图表
    onBeforeUnmount(() => {
      if (chart) {
        chart.dispose();
        chart = null;
      }
    });
    
    return {
      pixelRatio,
      touchStart,
      touchMove,
      touchEnd
    };
  }
};
</script>

<style scoped>
.echarts-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.echarts-canvas {
  width: 100%;
  height: 100%;
}
</style>