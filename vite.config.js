import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import { resolve } from 'path'

export default defineConfig({
  plugins: [uni()],
  vueCompilerOptions: {
    isCustomElement: tag => tag.startsWith('u-') 
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@@': resolve(__dirname, ''),
      'api': resolve(__dirname, 'api'),
      'utils': resolve(__dirname, 'utils'),
      'components': resolve(__dirname, 'components')
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  // 添加Vue编译器选项
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false
  },
  // 配置Vue编译器选项
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => {
          // 将uview-plus组件标记为自定义元素
          return tag.startsWith('u-')
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      // 'uview-plus/libs/config/config.js',
      // 'uview-plus/libs/mixin/mixin.js', 
      // 'uview-plus/components/u-search/u-search.vue' 
    ],
    // exclude: ['uview-plus']
  },
  css: {
    // preprocessorOptions: {
    //   scss: {
    //     additionalData: `@import "@/uni.scss";`,  // 确保优先加载
    //     quietDeps: true // 忽略node_modules警告 
    //   }
    // }
  }
})