import http from '@/utils/http'
import { RootThunkAction } from '@/store'
import { ArticleDetail, CommentType } from '@/store/types'

// 定义后端article文章详情接口的返回类型
type ArticleDetailRes = {
  data: ArticleDetail
  message: string
}

/**
 * 获取文章详情
 * @param articleId 文章id
 * @returns
 */
export const getArticleInfo = (articleId: string): RootThunkAction => {
  return async (dispatch) => {
    const res = await http.get<ArticleDetailRes>(`/articles/${articleId}`)
    dispatch({
      type: 'article/saveArticleDetail',
      payload: res.data.data,
    })
  }
}

type CommentRes = {
  data: CommentType
  message: string
}

/**
 * 获取comment评论列表
 * @param params
 * @returns
 */
export const getArticleComments = (params: {
  type: string
  source: string
}): RootThunkAction => {
  return async (dispatch) => {
    const res = await http.get<CommentRes>('/comments', {
      params,
    })

    dispatch({
      type: 'article/saveComments',
      payload: res.data.data,
    })
  }
}

/**
 * 获取更多comment评论列表
 * @param params offset表示上一次获取到的评论的下一条评论id
 * @returns
 */
export const getMoreArticleComments = (params: {
  type: string
  source: string
  offset: string
}): RootThunkAction => {
  return async (dispatch) => {
    const res = await http.get<CommentRes>('/comments', {
      params,
    })

    dispatch({
      type: 'article/saveMoreComments',
      payload: res.data.data,
    })
  }
}
