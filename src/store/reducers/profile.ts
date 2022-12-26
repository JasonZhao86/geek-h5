import { InitType, ProfileAction } from '@/store/types'

/**
 * 依靠ts的类型推导无法准确推导出user和userProfile属性的类型，必须明确指定类型。
 * 同时初始化时没有指定各字段的初始值，报错提示不满足InitType类型，只需强行类型
 * 断言为InitType即可
 *  */
const initialState: InitType = {
  // 用户基本信息
  user: {},
  // 还要存另一个接口的用户详细信息
  userProfile: {},
} as InitType

export const profile = (state = initialState, action: ProfileAction) => {
  /**
   * 因为type和payload必须是一一对应的，此时无法统一结构，否则结构出来
   * 的type和payload类型不对，都是联合类型，无法最终固定。
   *  */
  // const { type, payload } = action
  switch (action.type) {
    case 'profile/user':
      return {
        ...state,
        user: { ...action.payload },
      }
    case 'profile/profile':
      return {
        ...state,
        userProfile: { ...action.payload },
      }
    default:
      return state
  }
}
