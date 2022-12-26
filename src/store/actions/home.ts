import http from '@/utils/http'
import {
  getLocalChannels,
  hasLocalChannels,
  hasToken,
  setLocalChannels,
} from '@/utils/storage'

import { ArticleList, Channel, HomeAction } from '@/store/types'
import { RootThunkAction } from '@/store'

/**
 * 将用户频道保存到 Redux
 * @param {Array} payload
 * @returns
 */
export const setUserChannels = (payload: Channel[]): HomeAction => {
  return {
    type: 'home/channel',
    payload,
  }
}

/**
 * 获取用户频道
 * @returns thunk
 */
export const getUserChannels = (): RootThunkAction => {
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
export const setAllChannels = (payload: Channel[]): HomeAction => {
  return {
    type: 'home/allChannel',
    payload,
  }
}

/**
 * 获取所有的频道
 */
export const getAllChannels = (): RootThunkAction => {
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
export const addChannel = (channel: Channel): RootThunkAction => {
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
export const delChannel = (channel: Channel): RootThunkAction => {
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
export const setArticleList = (payload: ArticleList): HomeAction => {
  return {
    type: 'home/articlelist',
    payload,
  }
}

/**
 * 获取文章列表数据
 * @param {*} channelId 频道ID
 * @param {*} timestamp 时间戳
 * @returns
 */
export const getArticleList = (
  channelId: number,
  timestamp: string
): RootThunkAction => {
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
export const setMoreArticleList = (payload: ArticleList): HomeAction => {
  return {
    type: 'home/more_articlelist',
    payload,
  }
}

/**
 * 获取更多文章列表数据（上拉加载更多）
 * @param {*} channelId 频道ID
 * @param {*} timestamp 时间戳
 * @returns
 */
export const getMoreArticleList = (
  channelId: number,
  timestamp: string
): RootThunkAction => {
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
export const setFeedbackAction = ({
  articleId,
  visible,
}: {
  articleId: string
  visible: boolean
}): HomeAction => {
  return {
    type: 'home/feedback_action',
    payload: {
      articleId,
      visible,
    },
  }
}
