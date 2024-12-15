
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// 按需导入模块（AutoImport，Components,ElementPlusResolver）
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      // 1. 配置elementPlus 采用的sass样式配色系统
      resolvers: [ElementPlusResolver({importStyle: 'sass'})],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // 2.自动导入定制化样式文件进行样式覆盖
        //  @use "@/styles/var.scss" as *;
        additionalData: `
          @use "@/styles/element/index.scss" as *;

        `,
      }
    }
  },
})
