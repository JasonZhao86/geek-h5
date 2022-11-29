const TOKEN_KEY = 'geek-park'

export const getTokenInfo = () =>
  JSON.parse(localStorage.getItem(TOKEN_KEY)) || {}

export const setToken = (tokenInfo) =>
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokenInfo))

export const removeToken = () => localStorage.removeItem(TOKEN_KEY)

export const hasToken = () => !!getTokenInfo().token
