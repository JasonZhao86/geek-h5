import { combineReducers } from 'redux'
import { login } from './login'
import { profile } from './profile'
import { search } from './search'
import home from './home'

// 组合各个 reducer 函数，成为一个根 reducer
const rootReducer = combineReducers({
  // 在这里配置有所的 reducer ...
  login,
  profile,
  home,
  search,
})

export default rootReducer
