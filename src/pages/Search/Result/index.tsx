import ArticleItem from '@/components/ArticleItem'
import NavBar from '@/components/NavBar'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import { getSearchResults } from '@/store/actions'
import { RootState } from '@/store'
import { InfiniteScroll } from 'antd-mobile-v5'
import styles from './index.module.scss'

const Result = () => {
  const history = useHistory()
  const location = useLocation()
  const dispatch = useDispatch()
  const params = new URLSearchParams(location.search)
  const q = params.get('q')!
  const searchResults = useSelector(
    (state: RootState) => state.search.searchResults
  )
  // 是否有更多数据
  const [hasMore, setHasMore] = useState(true)
  // 加载状态
  const [loading, setLoading] = useState(false)

  // 不再需要useEffect首次渲染时dispatch获取数据，因为loadMore在组件首次渲染时也会执行，并不需要上拉动作触发
  const loadMore = async () => {
    if (
      // 组件首次渲染时还没获取数据，redux中results为undefined
      searchResults.results &&
      searchResults.results.length === searchResults.total_count
    ) {
      setHasMore(false)
    }

    if (loading) return
    setLoading(true)
    try {
      await dispatch(getSearchResults(q, (searchResults.page || 0) + 1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.root}>
      {/* 顶部导航栏 */}
      <NavBar className="nav" onLeftClick={() => history.go(-1)}>
        搜索结果
      </NavBar>

      <div className="article-list">
        {searchResults.results?.map((item) => (
          <div
            key={item.art_id}
            onClick={() => history.push(`/article/${item.art_id}`)}
          >
            <ArticleItem article={item} onClose={() => {}} />
          </div>
        ))}
      </div>
      {/* 无限加载 */}
      <InfiniteScroll loadMore={loadMore} hasMore={hasMore} threshold={100} />
    </div>
  )
}

export default Result
