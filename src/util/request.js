import axios from 'axios'
// 创建axios实例
const service = axios.create({
  baseURL: '/', // api 的 base_url
  timeout: 10000 // 请求超时时间
})

export default service
