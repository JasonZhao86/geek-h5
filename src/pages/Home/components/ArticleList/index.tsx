import styles from './index.module.scss'
import ArticleItem from '@/components/ArticleItem'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getArticleList,
  getMoreArticleList,
  setFeedbackAction,
} from '@/store/actions'
import { PullToRefresh, InfiniteScroll } from 'antd-mobile-v5'
import { RootState } from '@/store'
import { useHistory } from 'react-router-dom'

type Props = {
  channelId: number
  aid?: number
}

/**
 * 文章列表组件
 * @param {String} props.channelId 当前文章列表所对应的频道ID
 * @param {String} props.aid 当前 Tab 栏选中的频道ID
 */
const ArticleList = ({ channelId, aid }: Props) => {
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    if (channelId === aid) {
      dispatch(getArticleList(channelId, Date.now() + ''))
    }
    setHasMore(true)
  }, [channelId, aid, dispatch])

  const res = useSelector((state: RootState) => state.home.articles[channelId])
  const { list } = res || []

  // 对应频道ID上没有文章，不做任何渲染
  if (!res) return null

  const { timestamp } = res

  const onRefresh = async () =>
    await dispatch(getArticleList(channelId, Date.now() + ''))

  const loadMore = async () => {
    // 如果不是当前频道，不加载数据
    if (channelId !== aid) return

    // 没有更多数据的处理
    if (!timestamp) {
      setHasMore(false)
      return
    }

    // 上一次下拉的数据还未加载完成，不允许下一次下拉加载
    if (loading) return

    setLoading(true)
    await dispatch(getMoreArticleList(channelId, timestamp))
    setLoading(false)
  }

  const onClose = (articleId: string) => {
    dispatch(
      setFeedbackAction({
        articleId,
        visible: true,
      })
    )
  }

  return (
    <div className={styles.root}>
      <div className="articles">
        <PullToRefresh onRefresh={onRefresh}>
          {list.map((item) => (
            <div
              className="article-item"
              key={item.art_id}
              onClick={() => history.push(`/article/${item.art_id}`)}
            >
              <ArticleItem
                className="article-item"
                article={item}
                onClose={onClose}
              />
            </div>
          ))}
          <InfiniteScroll
            loadMore={loadMore}
            hasMore={hasMore}
            threshold={100}
          />
        </PullToRefresh>
      </div>
    </div>
  )
}

export default ArticleList
