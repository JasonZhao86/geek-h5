import axios from 'axios'
import { getTokenInfo, setToken, removeToken } from '@/utils/storage'
import { Toast } from 'antd-mobile'
import { history } from './history'
import store from '@/store'
import { saveToken, clearToken } from '@/store/actions'

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
  async (error) => {
    // 获取错误信息中包含的请求配置信息和响应数据
    const { config, response } = error

    // 网络异常
    if (!response) {
      Toast.info('网络异常，请稍后重试', 1)
      return Promise.reject(error)
    }

    // 处理非401的错误返回信息
    if (response.status !== 401) {
      Toast.info(response.data.message, 1)
      return Promise.reject(error)
    }

    const { token, refresh_token } = getTokenInfo()
    // 处理401的错误返回信息,即 token 不正确造成的授权问题
    // 如果是没有 Token 或 Refresh Token
    if (!token || !refresh_token) {
      // 跳转到登录页，并携带上当前正在访问的页面(第二个参数，会被赋值给history.location.state属性)，等登录成功后再跳回该页面
      history.push('/login', {
        from: history.location.pathname || '/home',
      })
      return Promise.reject(error)
    }

    /**
     * Token失效，通过 Refresh Token 换取新 Token，特别说明：这个地方发请求的时候，
     * 不能使用新建的 http 实例去请求，要用默认实例 axios 去请求！否则会因 http 实
     * 例请求拦截器的作用，携带上老的 token 而不是 refresh_token
     */
    try {
      const res = await axios.put(`${config.baseURL}/authorizations`, null, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${refresh_token}`,
        },
      })

      // 将新换到的 Token 信息保存到 Redux 和 LocalStorage 中
      const tokenInfo = {
        token: res.data.data.token,
        refresh_token,
      }
      setToken(tokenInfo)
      store.dispatch(saveToken(tokenInfo))

      // 重新发送之前因 Token 无效而失败的请求
      return http(config)
    } catch (error) {
      // 如果换取新 token 失败，则清空本地已有的 Token 信息后，跳转到登录页
      // 清除 Redux 和 LocalStorage 中无效的 Token 信息
      removeToken()
      store.dispatch(clearToken())

      // 跳转到登录页，并携带上当前正在访问的页面，等登录成功后再跳回该页面
      history.push('/login', {
        from: history.location.pathname || '/home',
      })

      return Promise.reject(error)
    }
  }
)

export default http
