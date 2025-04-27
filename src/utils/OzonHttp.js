/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-04-23 10:23:37
 * @LastEditTime: 2025-04-25 15:32:28
 * @LastEditors: Zane Xu
 */
// axios基础封装
import axios from "axios";
import { showMessage } from "./Ealert";

const httpInstance =  axios.create({
  baseURL:"https://api-seller.ozon.ru",
  timeout:5000,
  headers:{
    'Content-Type': 'application/json'
  }
})

// 请求拦截器（双字段注入）
httpInstance.interceptors.request.use(
  (config) => {
    // 从环境变量/父级模块获取认证信息
    const authConfig = {
      'Api-Key': import.meta.env.VITE_OZON_KEY ,
      'Client-Id':  import.meta.env.VITE_OZON_CLIENT_ID  // 直接使用用户提供的Client-Id
    }

    // 批量添加认证头（避免覆盖原有headers）
    config.headers  = {
      ...config.headers,
      ...authConfig
    }

    return config
  },
  (error) => {
    showMessage("Request  Interceptor Error:",error)
    return Promise.reject(error)
  }
)

// 响应拦截器（错误处理增强）
httpInstance.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status  === 401) {
      console.error(' 认证失败，请检查Api-Key和Client-Id')
    }
    return Promise.reject(error.response?.data  || error)
  }
)



export default httpInstance
