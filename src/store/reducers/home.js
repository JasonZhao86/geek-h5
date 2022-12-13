import {
  HOME_SET_USERCHANNELS,
  HOME_SET_ALLCHANNELS,
  HOME_SET_ARTICLELIST,
  HOME_SET_MORE_ARTICLELIST,
  HOME_FEEDBACK_ACTION,
} from '../action-types'

const initialState = {
  // 用户频道
  userChannels: [],
  // 所有频道
  allChannels: [],
  // 所有文章
  articles: {},
  // 举报的文章id和是否显示modal弹窗
  feedbackAction: {
    articleId: 0,
    visible: false,
  },
}

const reducer = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case HOME_SET_USERCHANNELS:
      return { ...state, userChannels: payload }
    case HOME_SET_ALLCHANNELS:
      return { ...state, allChannels: payload }
    case HOME_SET_ARTICLELIST:
      return {
        ...state,
        articles: {
          ...state.articles,
          [payload.channelId]: {
            timestamp: payload.timestamp,
            list: payload.list,
          },
        },
      }
    case HOME_SET_MORE_ARTICLELIST:
      const oldList = state.articles[payload.channelId].list
      return {
        ...state,
        articles: {
          ...state.articles,
          [payload.channelId]: {
            timestamp: payload.timestamp,
            list: [...oldList, ...payload.list],
          },
        },
      }
    case HOME_FEEDBACK_ACTION:
      return {
        ...state,
        feedbackAction: payload,
      }
    default:
      return state
  }
}

export default reducer
