import http from '@/utils/http'
import { RootThunkAction } from '@/store'
import { SearchAction, SearchResultsType } from '@/store/types'
import { setLocalHistories, removeLocalHistories } from '@/utils/storage'

/**
 * 定义axios.request<T>()，axios.get<T>()，axios.post<T>()等方法返回值
 * 的data属性的类型，T默认是any类型，用于指定data的类型
 *  */
type SuggestionListRes = {
  data: {
    options: string[]
  }
  message: string
}

export const getSuggestions = (keyword: string): RootThunkAction => {
  return async (dispatch) => {
    const res = await http.get<SuggestionListRes>('/suggestion', {
      params: {
        q: keyword,
      },
    })
    let options = res.data.data.options
    /**
     * 后台搜索结果如果没有数据，返回的结果为[null]，遍历就会报错，
     * 所以如果是这种情况，默认为[]
     */
    if (options.length > 0 && !options[0]) {
      options = []
    }
    dispatch({
      type: 'search/saveSuggestions',
      payload: options,
    })
  }
}

/**
 * 清空搜索建议
 * @returns thunk
 */
export const clearSuggestions = (): SearchAction => {
  return {
    type: 'search/clearSuggestions',
  }
}

/**
 * 清空搜索建议
 * @param {string} key 搜索的关键字
 * @returns thunk
 */
export const addSearchList = (key: string): RootThunkAction => {
  return async (dispatch, getState) => {
    // 获取原来的histories
    let histories = getState().search.histories
    /**
     * 将历史数组放入Set中，就能自动去除重复的关键字，
     * 注意：Set 只对基础类型的值有自动去重功能，对象无效
     *  */
    let histories_set = new Set([key, ...histories])
    // 去重后将 Set 转回数组
    histories = Array.from(histories_set)
    // histories = histories.filter((item) => item !== key)
    // histories = [key, ...histories]
    // 保存到redux
    if (histories.length > 10) {
      histories = histories.slice(0, 10)
    }
    dispatch({
      type: 'search/saveHistories',
      payload: histories,
    })
    // 保存到本地
    setLocalHistories(histories)
  }
}

/**
 * 清除全部的搜索记录
 * @returns RootThunkAction
 */
export const clearHistories = (): RootThunkAction => {
  return async (dispatch) => {
    // 删除 Redux 中的历史记录
    dispatch({
      type: 'search/clearHistories',
    })

    // 删除 LocalStorage 中的历史记录
    removeLocalHistories()
  }
}

type SearchResultsRes = {
  data: SearchResultsType
  message: string
}

/**
 * 获取搜索结果
 * @returns RootThunkAction
 */
export const getSearchResults = (q: string, page: number): RootThunkAction => {
  return async (dispatch) => {
    const res = await http.get<SearchResultsRes>('/search', {
      params: {
        q,
        page,
        per_page: 10,
      },
    })

    dispatch({
      type: 'search/saveSearchResults',
      payload: res.data.data,
    })
  }
}
