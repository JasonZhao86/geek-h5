import http from '@/utils/request'
import { User, Profile, ProfileAction } from '../reducers/profile'
import { RootThunkAction } from '..'
/**
 * 保存用户信息
 * @param {*} payload
 * @returns
 */
// actionCreator: 创建action  必须要符合 ProfileAction类型
export const saveUser = (payload: User): ProfileAction => {
  return {
    type: 'profile/user',
    payload: payload,
  }
}

/**
 * 获取用户信息
 * @returns Promise
 */
export const getUser = (): RootThunkAction => {
  return async (dispatch) => {
    const res = await http.get('/user')
    dispatch(saveUser(res.data))
  }
}

export const saveProfile = (payload: Profile): ProfileAction => {
  return {
    type: 'profile/profile',
    payload,
  }
}

export const getProfile = (): RootThunkAction => {
  return async (dispatch) => {
    const res = await http.get('/user/profile')
    dispatch(saveProfile(res.data))
  }
}

// 返回一个全部属性变成可选的类型
type PartialProfile = Partial<Profile>
// 修改用户的信息
// dispatch: Dispatch类型，，，参数必须符合Action类型 {type: T}
export const updateProfile = (data: PartialProfile): RootThunkAction => {
  return async (dispatch) => {
    await http.patch('/user/profile', data)
    dispatch(getProfile())
  }
}

export const updatePhoto = (fd: FormData): RootThunkAction => {
  return async (dispatch) => {
    await http.patch('/user/photo', fd)
    dispatch(getProfile())
  }
}
