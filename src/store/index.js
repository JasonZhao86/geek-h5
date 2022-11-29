import { applyMiddleware, createStore } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import { getTokenInfo } from '@/utils/storage'

const store = createStore(
  rootReducer,
  {
    login: getTokenInfo(),
  },
  composeWithDevTools(applyMiddleware(thunk))
)

export default store
