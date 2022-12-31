import { applyMiddleware, createStore } from 'redux'
import thunk, { ThunkAction } from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import rootReducer from './reducers'
import { getTokenInfo, getLocalHistories } from '@/utils/storage'
import {
  LoginAction,
  HomeAction,
  ProfileAction,
  SearchAction,
  SearchResultsType,
} from '@/store/types'

const store = createStore(
  rootReducer,
  {
    login: getTokenInfo(),
    search: {
      suggestions: [],
      histories: getLocalHistories(),
      searchResults: {} as SearchResultsType,
    },
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
