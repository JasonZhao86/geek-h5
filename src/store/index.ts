import { applyMiddleware, createStore } from 'redux'
import thunk, { ThunkAction } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import { getTokenInfo } from '@/utils/storage'
import {
  LoginAction,
  HomeAction,
  ProfileAction,
  SearchAction,
} from '@/store/types'

const store = createStore(
  rootReducer,
  {
    login: getTokenInfo(),
  },
  composeWithDevTools(applyMiddleware(thunk))
)

export type RootState = ReturnType<typeof store.getState>

type RootAction = LoginAction | HomeAction | ProfileAction | SearchAction

export type RootThunkAction = ThunkAction<
  Promise<void>,
  RootState,
  any,
  RootAction
>

export default store
