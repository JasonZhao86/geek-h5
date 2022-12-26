import http from '@/utils/http'
import { removeToken, setToken } from '@/utils/storage'
import { Dispatch } from 'redux'
import { Token, LoginAction } from '@/store/types'

/**
 * 发送验证码
 * @param {string} mobile 手机号码
 * @returns thunk
 */
export const sendValidationCode = (mobile: string) => {
  return () => {
    http.get(`/sms/codes/${mobile}`)
  }
}

export const saveToken = (payload: Token): LoginAction => {
  return {
    type: 'login/token',
    payload,
  }
}

export const login = (params: { mobile: string; code: string }) => {
  return async (dispatch: Dispatch) => {
    const res = await http.post('/authorizations', params)
    const tokenInfo = res.data.data
    dispatch(saveToken(tokenInfo))
    setToken(tokenInfo)
  }
}

/**
 * 将 Token 信息从 Redux 中删除
 */
export const clearToken = (): LoginAction => {
  return {
    type: 'login/clear',
  }
}

/**
 * 登出
 * @returns thunk
 */
export const logout = () => {
  return (dispatch: Dispatch) => {
    // 删除 Redux 中的 Token 信息
    dispatch(clearToken())
    // 删除 LocalStorage 中的 Token 信息
    removeToken()
  }
}
