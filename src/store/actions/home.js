import http from '@/utils/http'
import {
  getLocalChannels,
  hasLocalChannels,
  hasToken,
  setLocalChannels,
} from '@/utils/storage'
import {
  HOME_FEEDBACK_ACTION,
  HOME_SET_ALLCHANNELS,
  HOME_SET_ARTICLELIST,
  HOME_SET_MORE_ARTICLELIST,
  HOME_SET_USERCHANNELS,
} from '../action-types'

/**
 * 将用户频道保存到 Redux
 * @param {Array} payload
 * @returns
 */
export const setUserChannels = (payload) => {
  return {
    type: HOME_SET_USERCHANNELS,
    payload,
  }
}

/**
 * 获取用户频道
 * @returns thunk
 */
export const getUserChannels = () => {
  return async (dispatch) => {
    // 有token
    if (hasToken()) {
      const res = await http.get('/user/channels')
      const { channels } = res.data.data
      dispatch(setUserChannels(channels))
      return
    }
    // 没有token但是有本地channels数据
    if (hasLocalChannels()) {
      const channels = getLocalChannels()
      dispatch(setUserChannels(channels))
    } else {
      // 没有token也没有本地channels数据
      const res = await http.get('/user/channels')
      const { channels } = res.data.data
      dispatch(setUserChannels(channels))
      // 保存到本地
      setLocalChannels(channels)
    }
  }
}

/**
 * 保存所有的频道
 * @param {Array} payload
 * @returns
 */
export const setAllChannels = (payload) => {
  return {
    type: HOME_SET_ALLCHANNELS,
    payload,
  }
}

/**
 * 获取所有的频道
 */
export const getAllChannels = () => {
  return async (dispatch) => {
    const res = await http.get('/channels')
    const { channels } = res.data.data
    // 将所有频道数据保存到 Redux
    dispatch(setAllChannels(channels))
  }
}

/**
 * 新增用户频道
 * @param {object} channel
 * @returns
 */
export const addChannel = (channel) => {
  // thunk的第二个参数，它是一个函数，可以获取到store中的所有state状态
  return async (dispatch, getState) => {
    // 获取到所有的userChannels
    const { userChannels } = getState().home
    // 如果登录了，发送请求更新频道信息
    if (hasToken()) {
      await http.patch('/user/channels', {
        channels: [channel],
      })
    } else {
      // 如果没有登录，将channels频道数据保存到本地
      setLocalChannels([...userChannels, channel])
    }
    dispatch(setUserChannels([...userChannels, channel]))
  }
}

/**
 * 删除用户频道
 * @param {object} channel
 * @returns
 */
export const delChannel = (channel) => {
  // thunk的第二个参数，它是一个函数，可以获取到store中的所有state状态
  return async (dispatch, getState) => {
    // 获取到所有的userChannels
    const { userChannels } = getState().home
    // 如果登录了，发送请求删除频道信息
    if (hasToken()) {
      await http.delete(`/user/channels/${channel.id}`)
    } else {
      // 如果没有登录，将channels频道数据保存到本地
      setLocalChannels(userChannels.filter((item) => item.id !== channel.id))
    }

    dispatch(
      setUserChannels(userChannels.filter((item) => item.id !== channel.id))
    )
  }
}

/**
 *
 * @param {object} payload 文章列表
 * @returns action
 */
export const setArticleList = (payload) => {
  return {
    type: HOME_SET_ARTICLELIST,
    payload,
  }
}

/**
 * 获取文章列表数据
 * @param {*} channelId 频道ID
 * @param {*} timestamp 时间戳
 * @returns
 */
export const getArticleList = (channelId, timestamp) => {
  return async (dispatch) => {
    const res = await http.get('/articles', {
      params: {
        channel_id: channelId,
        timestamp: timestamp,
      },
    })

    dispatch(
      setArticleList({
        // 文章列表所属的频道ID
        channelId,
        // 用于获取剩余的文章列表
        timestamp: res.data.data.pre_timestamp,
        list: res.data.data.results,
      })
    )
  }
}

/**
 *
 * @param {object} payload 文章列表
 * @returns action
 */
export const setMoreArticleList = (payload) => {
  return {
    type: HOME_SET_MORE_ARTICLELIST,
    payload,
  }
}

/**
 * 获取更多文章列表数据（上拉加载更多）
 * @param {*} channelId 频道ID
 * @param {*} timestamp 时间戳
 * @returns
 */
export const getMoreArticleList = (channelId, timestamp) => {
  return async (dispatch) => {
    const res = await http.get('/articles', {
      params: {
        channel_id: channelId,
        timestamp: timestamp,
      },
    })

    dispatch(
      setMoreArticleList({
        // 文章列表所属的频道ID
        channelId,
        // 用于获取剩余的文章列表
        timestamp: res.data.data.pre_timestamp,
        list: res.data.data.results,
      })
    )
  }
}

/**
 *
 * @param {number} articleId 举报的文章ID号
 * @param {boolean} visible modal框是否显示
 * @returns
 */
export const setFeedbackAction = ({ articleId, visible }) => {
  return {
    type: HOME_FEEDBACK_ACTION,
    payload: {
      articleId,
      visible,
    },
  }
}
