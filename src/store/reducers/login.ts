import { LoginAction, Token } from '@/store/types'

const initialState = {
  token: '',
  refresh_token: '',
}

const login = (state = initialState, action: LoginAction) => {
  switch (action.type) {
    case 'login/token':
      return { ...action.payload }
    case 'login/clear':
      // 返回的必须是一个Token类型，否则store/index.ts会提示Token类型赋值给undefined的类型错误
      return {} as Token
    default:
      return state
  }
}

export { login }
