import http from '@/utils/http'
import {
  PROFILE_SAVE_PROFILE,
  PROFILE_SAVE_USER,
  PROFILE_UPDATE_PROFILE,
} from '@/store/action-types'

const saveUser = (payload) => {
  return {
    type: PROFILE_SAVE_USER,
    payload,
  }
}

export const getUser = () => {
  return async (dispatch) => {
    const res = await http.get('/user')
    dispatch(saveUser(res.data.data))
  }
}

export const saveProfile = (payload) => {
  return {
    type: PROFILE_SAVE_PROFILE,
    payload,
  }
}

export const getUserProfile = () => {
  return async (dispatch) => {
    const res = await http.get('/user/profile')
    dispatch(saveProfile(res.data.data))
  }
}

/**
 * 修改个人详情：昵称、简介、生日、性别 （每次修改一个字段）
 * @param {String} name 要修改的字段名称
 * @param {*} value 要修改的字段值
 */
export const updateUserProfile = (name, value) => {
  return {
    type: PROFILE_UPDATE_PROFILE,
    payload: { name, value },
  }
}

/**
 * 修改个人详情：昵称、简介、生日、性别 （每次修改一个字段）
 * @param {String} name 要修改的字段名称
 * @param {*} value 要修改的字段值
 * @returns thunk
 */
export const updateProfile = (name, value) => {
  return async (dispatch) => {
    // 调用接口将数据更新到后端
    const res = await http.patch('/user/profile', { [name]: value })
    // 如果后端更新成功，则再更新 Redux 中的数据，重新渲染页面上的数据
    if (res.data.message === 'OK') {
      dispatch(updateUserProfile(name, value))
    }
  }
}

/**
 * 更新头像
 * @param {FormData} formData 上次图片必须用formData格式的表单
 * @returns thunk
 */
export const updateAvatar = (formData) => {
  return async (dispatch) => {
    const res = await http.patch('/user/photo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    // 获取后端返回的图片地址，更新到 Redux 中
    const { photo } = res.data.data
    dispatch(updateUserProfile('photo', photo))
  }
}
