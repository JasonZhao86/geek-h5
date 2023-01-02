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

/**
 * 点赞文章
 * @param articleId 文章id号
 * @param attitude 喜欢：1、不喜欢：0，踩：-1
 * @returns
 */
export const setArticleLiking = (
  articleId: string,
  attitude: number
): RootThunkAction => {
  return async (dispatch) => {
    if (attitude === 1) {
      // 取消点赞，之前是喜欢，现在是不喜欢
      await http.delete('/article/likings/' + articleId)
    } else {
      // 点赞，只考虑喜欢和不喜欢的情况，其他情况（踩:-1的情况）统统定为不喜欢
      await http.post('/article/likings', {
        target: articleId,
      })
    }
    // 请求发送成功后，更新redux中的数据，重新刷新页面
    await dispatch(getArticleInfo(articleId))
  }
}

/**
 * 收藏文章
 * @param articleId 文章id号
 * @param is_collected 0：未收藏， 1：已经收藏
 * @returns
 */
export const setAritcleCollection = (
  articleId: string,
  is_collected: boolean
): RootThunkAction => {
  return async (dispatch) => {
    if (is_collected) {
      // 取消收藏
      await http.delete('/article/collections/' + articleId)
    } else {
      // 收藏
      await http.post('/article/collections', {
        target: articleId,
      })
    }
    dispatch(getArticleInfo(articleId))
  }
}
