/*
 * @Description:
 * @Author: Zane Xu
 * @Date: 2025-03-31 17:34:19
 * @LastEditTime: 2025-03-31 17:34:51
 * @LastEditors: Zane Xu
 */
// axios基础封装
import axios from "axios";

const httpInstance =  axios.create({
  baseURL:"https://api-seller.ozon.ru",
  timeout:5000
})

//目前这两个没啥用，以后再用
// axios请求拦截器
httpInstance.interceptors.request.use(config => {
  return config
}, e => Promise.reject(e))

// axios响应式拦截器
httpInstance.interceptors.response.use(res => res.data, e => {

  return Promise.reject(e)
})


export default httpInstance
