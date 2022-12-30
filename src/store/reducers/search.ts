import { SearchType, SearchAction } from '@/store/types'

const initValue: SearchType = {
  // 存放推荐的结果
  suggestions: [],
}

export const search = (state = initValue, action: SearchAction) => {
  switch (action.type) {
    case 'search/saveSuggestions':
      return { ...state, suggestions: action.payload }
    default:
      return state
  }
}
