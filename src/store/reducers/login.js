import { LOGIN_TOKEN, LOGOUT_CLEAR } from '../action-types'

const initialState = {
  token: '',
  refresh_token: '',
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_TOKEN:
      return { ...action.payload }
    case LOGOUT_CLEAR:
      return {}
    default:
      return state
  }
}

export { login }
