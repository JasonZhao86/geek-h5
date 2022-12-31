import { SearchType, SearchAction } from '@/store/types'

const initValue: SearchType = {
  // 存放推荐的结果
  suggestions: [],
  histories: [],
  searchResults: {
    page: -1,
    per_page: -1,
    results: [],
    total_count: -1,
  },
}

export const search = (state = initValue, action: SearchAction) => {
  switch (action.type) {
    case 'search/saveSuggestions':
      return { ...state, suggestions: action.payload }
    case 'search/clearSuggestions':
      return { ...state, suggestions: [] }
    case 'search/saveHistories':
      return { ...state, histories: action.payload }
    case 'search/clearHistories':
      return { ...state, histories: [] }
    case 'search/saveSearchResults':
      // 搜索结果页首次渲染是state.searchResults.results为undefined
      let oldResults = state.searchResults.results || []
      return {
        ...state,
        searchResults: {
          ...action.payload,
          results: [...action.payload.results, ...oldResults],
        },
      }
    default:
      return state
  }
}
