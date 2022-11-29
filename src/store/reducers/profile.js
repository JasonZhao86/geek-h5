import {
  PROFILE_SAVE_USER,
  PROFILE_SAVE_PROFILE,
  PROFILE_UPDATE_PROFILE,
} from '@/store/action-types'

const initialState = {
  // 用户基本信息
  user: {},
  // 还要存另一个接口的用户详细信息
  userProfile: {},
}

export const profile = (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case PROFILE_SAVE_USER:
      return {
        ...state,
        user: { ...payload },
      }
    case PROFILE_SAVE_PROFILE:
      return {
        ...state,
        userProfile: { ...payload },
      }
    case PROFILE_UPDATE_PROFILE:
      return {
        ...state,
        userProfile: {
          ...state.userProfile,
          [payload.name]: payload.value,
        },
      }
    default:
      return state
  }
}
