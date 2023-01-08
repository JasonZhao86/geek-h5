import { ArticleType, ArticleAction } from '@/store/types'

const initState: ArticleType = {
  // 存储文章详情
  articleDetail: {},
  // 存储评论
  comments: {},
} as ArticleType

export const article = (state = initState, action: ArticleAction) => {
  switch (action.type) {
    case 'article/saveArticleDetail':
      return { ...state, articleDetail: action.payload }
    case 'article/saveComments':
      return { ...state, comments: action.payload }
    case 'article/saveMoreComments':
      return {
        ...state,
        comments: {
          ...action.payload,
          // 新增评论，而非覆盖
          results: [...state.comments.results, ...action.payload.results],
        },
      }
    case 'article/saveNewComment':
      return {
        ...state,
        comments: {
          ...state.comments,
          // 新增评论，而非覆盖
          results: [action.payload, ...state.comments.results],
        },
      }
    case 'article/updateComment':
      return {
        ...state,
        comments: {
          ...state.comments,
          // 将添加成功的评论回复更新到评论的回复列表中，替换该条评论的旧回复列表
          results: state.comments.results.map((item) => {
            // 被添加回复的那条评论
            if (item.com_id === action.payload.com_id) {
              return action.payload
            } else {
              // 其他评论的回复列表
              return item
            }
          }),
        },
      }
    default:
      return state
  }
}
