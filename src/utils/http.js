// axios基础封装
import axios from "axios";

const httpInstance =  axios.create({
  baseURL:"http://localhost:49131/api",
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
