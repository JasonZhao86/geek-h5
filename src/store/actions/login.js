import http from '@/utils/http'
import { LOGIN_TOKEN, LOGOUT_CLEAR } from '../action-types'
import { removeToken, setToken } from '@/utils/storage'

/**
 * 发送验证码
 * @param {string} mobile 手机号码
 * @returns thunk
 */
export const sendValidationCode = (mobile) => {
  return () => {
    http.get(`/sms/codes/${mobile}`)
  }
}

export const saveToken = (payload) => {
  return {
    type: LOGIN_TOKEN,
    payload,
  }
}

export const login = (params) => {
  return async (dispatch) => {
    const res = await http.post('/authorizations', params)
    const tokenInfo = res.data.data
    dispatch(saveToken(tokenInfo))
    setToken(tokenInfo)
  }
}

/**
 * 将 Token 信息从 Redux 中删除
 */
export const clearToken = () => {
  return {
    type: LOGOUT_CLEAR,
  }
}

/**
 * 登出
 * @returns thunk
 */
export const logout = () => {
  return (dispatch) => {
    // 删除 Redux 中的 Token 信息
    dispatch(clearToken())
    // 删除 LocalStorage 中的 Token 信息
    removeToken()
  }
}
