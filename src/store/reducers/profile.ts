export type User = {
  id: string
  name: string
  photo: string
  art_count: number
  follow_count: number
  fans_count: number
  like_count: number
}

export type Profile = {
  id: string
  photo: string
  name: string
  mobile: string
  gender: number
  birthday: string
}

type InitType = {
  user: User
  profile: Profile
}

export type ProfileAction =
  | {
      type: 'profile/user'
      payload: User
    }
  | {
      type: 'profile/profile'
      payload: Profile
    }

const initValue: InitType = {
  user: {},
  profile: {},
} as InitType

/**
 * 处理个人信息的reducer
 * @param {*} state
 * @param {*} action
 * @returns
 */
export default function reducer(state = initValue, action: ProfileAction) {
  // const { type, payload } = action
  if (action.type === 'profile/user') {
    return {
      ...state,
      user: action.payload,
    }
  }
  if (action.type === 'profile/profile') {
    return {
      ...state,
      profile: action.payload,
    }
  }
  return state
}
