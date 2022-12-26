import { HomeType, HomeAction } from '@/store/types'

const initialState: HomeType = {
  // 用户频道
  userChannels: [],
  // 所有频道
  allChannels: [],
  // 所有文章
  articles: {},
  // 举报的文章id和是否显示modal弹窗
  feedbackAction: {
    visible: false,
    articleId: '',
    // channelId: -1,
  },
} as HomeType

const reducer = (state = initialState, action: HomeAction) => {
  switch (action.type) {
    case 'home/channel':
      return { ...state, userChannels: action.payload }
    case 'home/allChannel':
      return { ...state, allChannels: action.payload }
    case 'home/articlelist':
      const { channelId, timestamp, list } = action.payload
      return {
        ...state,
        articles: {
          ...state.articles,
          [channelId]: {
            timestamp: timestamp,
            list: list,
          },
        },
      }
    case 'home/more_articlelist':
      const oldList = state.articles[action.payload.channelId].list
      return {
        ...state,
        articles: {
          ...state.articles,
          [action.payload.channelId]: {
            timestamp: action.payload.timestamp,
            list: [...oldList, ...action.payload.list],
          },
        },
      }
    case 'home/feedback_action':
      return {
        ...state,
        feedbackAction: action.payload,
      }
    default:
      return state
  }
}

export default reducer
