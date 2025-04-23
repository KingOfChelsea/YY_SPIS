/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2024-12-15 10:04:19
 * @LastEditTime: 2025-04-09 21:07:56
 * @LastEditors: Zane Xu
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import '@/styles/common.scss'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.use(createPinia())
app.use(router)

app.mount('#app')


