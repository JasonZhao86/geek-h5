import axios from 'axios'
import { getTokenInfo } from '@/utils/storage'
import { Toast } from 'antd-mobile'

const http = axios.create({
  // baseURL: 'http://geek.itheima.net/v1_0'
  baseURL: 'http://toutiao.itheima.net/v1_0',
  timeout: 5000,
})

http.interceptors.request.use((config) => {
  // if (config.method === 'post') {
  //   config.headers['Content-Type'] = 'application/json'
  // }
  const token = getTokenInfo().token || ''
  config.headers['Authorization'] = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (response) => {
    // return response.data
    return response
  },
  (error) => {
    if (error.response) {
      Toast.info(error.response.data.message, 1)
    } else {
      Toast.info('网络异常，请稍后重试', 1)
    }
    return Promise.reject(error)
  }
)

export default http
