const TOKEN_KEY = 'geek-park'
const CHANNELS_KEY = 'geek-channels'

export const getTokenInfo = () =>
  JSON.parse(localStorage.getItem(TOKEN_KEY)) || {}

export const setToken = (tokenInfo) =>
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenInfo))

export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

export const hasToken = () => !!getTokenInfo().token

/**
 * 保存频道数据到本地
 * @param {Array} channels
 */
export const setLocalChannels = (channels) =>
  localStorage.setItem(CHANNELS_KEY, JSON.stringify(channels))

/**
 * 获取本地的频道数据，如果没有数据，不要默认为空数组
 * @returns
 */
export const getLocalChannels = () =>
  JSON.parse(localStorage.getItem(CHANNELS_KEY))

/**
 * 删除本地的频道数据
 */
export const removeLocalChannels = () => localStorage.removeItem(CHANNELS_KEY)

/**
 * 判断时候有本地频道数据
 */
export const hasLocalChannels = () => !!getLocalChannels()
