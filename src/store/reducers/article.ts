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
    default:
      return state
  }
}
