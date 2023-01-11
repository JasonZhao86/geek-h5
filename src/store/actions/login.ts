import request from '@/utils/request'
import { setTokenInfo } from '@/utils/storage'
import { Dispatch } from 'redux'
import { LoginAction } from '../reducers/login'
export const sendCode = (mobile: string) => {
  return async () => {
    // 发送请求
    await request({
      url: '/sms/codes/' + mobile,
      method: 'get',
    })
  }
}

type Token = {
  token: string
  refresh_token: string
}

// actionCreator
export const saveToken = (payload: Token): LoginAction => {
  return {
    type: 'login/token',
    payload,
  }
}

/**
 * 登录功能
 * @param {*} data
 * @returns
 */
export const login = (data: { mobile: string; code: string }) => {
  // dispatch发送的action必须要有type属性，，，以及任意的其他属性
  return async (dispatch: Dispatch) => {
    const res = await request({
      method: 'post',
      url: '/authorizations',
      data,
    })

    // 保存token到redux中
    dispatch(saveToken(res.data))
    // 保存到本地
    setTokenInfo(res.data)
  }
}

/**
 * 退出
 * @returns
 */
export const logout = (payload: Token) => {
  return {
    type: 'login/logout' as const,
    payload,
  }
}
