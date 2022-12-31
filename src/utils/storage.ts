const TOKEN_KEY = 'geek-park'
const CHANNELS_KEY = 'geek-channels'
// 搜索关键字的本地缓存键名
const SEARCH_HIS_KEY = 'itcast_history_k'

type TokenInfo = {
  token: string
  refresh_token: string
}

type Channels = {
  id: number
  name: string
}[]

export const getTokenInfo = (): TokenInfo =>
  // 方法一：
  // JSON.parse(localStorage.getItem(TOKEN_KEY) || '{}')
  // 方法二：断言，强制将类型断言为string
  // JSON.parse(localStorage.getItem(TOKEN_KEY) as string) || {}
  // 方法三：非空断言，JSON.parse(null)也不会报错，所以这里直接非空断言是可以的
  JSON.parse(localStorage.getItem(TOKEN_KEY)!) || {}

export const setToken = (tokenInfo: TokenInfo): void =>
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenInfo))

export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

export const hasToken = (): boolean => !!getTokenInfo().token

/**
 * 保存频道数据到本地
 * @param {Array} channels
 */
export const setLocalChannels = (channels: Channels): void =>
  localStorage.setItem(CHANNELS_KEY, JSON.stringify(channels))

/**
 * 获取本地的频道数据，如果没有数据，不要默认为空数组
 * @returns
 */
export const getLocalChannels = (): Channels =>
  JSON.parse(localStorage.getItem(CHANNELS_KEY)!)

/**
 * 删除本地的频道数据
 */
export const removeLocalChannels = (): void =>
  localStorage.removeItem(CHANNELS_KEY)

/**
 * 判断时候有本地频道数据
 */
export const hasLocalChannels = (): boolean => !!getLocalChannels()

/**
 * 从缓存获取搜索历史关键字
 */
export const getLocalHistories = (): string[] =>
  JSON.parse(localStorage.getItem(SEARCH_HIS_KEY)!) || []

/**
 * 将搜索历史关键字存入本地缓存
 * @param {Array} histories
 */
export const setLocalHistories = (histories: string[]) =>
  localStorage.setItem(SEARCH_HIS_KEY, JSON.stringify(histories))

/**
 * 删除本地缓存中的搜索历史关键字
 */
export const removeLocalHistories = () =>
  localStorage.removeItem(SEARCH_HIS_KEY)
