import http from '@/utils/http'
import { Dispatch } from 'redux'
import { User, Profile, ProfileAction, PartialProfile } from '@/store/types'
import { RootThunkAction } from '@/store'

export const saveUser = (payload: User): ProfileAction => {
  return {
    type: 'profile/user',
    payload,
  }
}

export const getUser = () => {
  return async (dispatch: Dispatch) => {
    const res = await http.get('/user')
    dispatch(saveUser(res.data.data))
  }
}

export const saveProfile = (payload: Profile): ProfileAction => {
  return {
    type: 'profile/profile',
    payload,
  }
}

export const getUserProfile = () => {
  return async (dispatch: Dispatch) => {
    const res = await http.get('/user/profile')
    dispatch(saveProfile(res.data.data))
  }
}

/**
 * 修改个人详情：昵称、简介、生日、性别 （每次修改一个字段）
 * @param {object} data 要修改的字段名称和值
 * @returns thunk
 */
export const updateProfile = (data: PartialProfile): RootThunkAction => {
  /**
   * getUserProfile返回的并不是一个ProfileAction类型的action，所以此
   * 处dispatch不能定义为Dispatch类型，Dispatch类型要求必须是一个Action
   * 类型，即必须具有type属性的action对象。后面再解决该问题，暂时用any替代
   */
  return async (dispatch) => {
    // 调用接口将数据更新到后端
    const res = await http.patch('/user/profile', data)
    /**
     * 如果后端更新成功，则再更新Redux中的数据，重新渲染页面上的数据，
     * 直接复用前面定义的redux thunk：getUserProfile
     *  */
    if (res.data.message === 'OK') {
      dispatch(getUserProfile())
    }
  }
}

/**
 * 更新头像
 * @param {FormData} formData 上次图片必须用formData格式的表单
 * @returns thunk
 */
export const updateAvatar = (formData: FormData): RootThunkAction => {
  return async (dispatch) => {
    await http.patch('/user/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // 直接复用前面定义的redux thunk：getUserProfile
    dispatch(getUserProfile())
  }
}
