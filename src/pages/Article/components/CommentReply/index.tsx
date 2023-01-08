import NavBar from '@/components/NavBar'
import NoComment from '@/components/NoComment'
import { CommentDetail } from '@/store/types'
import { useEffect, useState } from 'react'
import http from '@/utils/http'
import CommentFooter from '../CommentFooter'
import CommentItem from '../CommentItem'
import { CommentRes } from '@/store/actions/article'
import { CommentType } from '@/store/types'
import { InfiniteScroll } from 'antd-mobile-v5'
import styles from './index.module.scss'

type Props = {
  articleId: string
  onClose: () => void
  comment: CommentDetail
}

const CommentReply = ({ articleId, onClose, comment }: Props) => {
  // 演示直接在组件中发请求获取并渲染数据要注意的问题：首次渲染组件并渲染获取到的数据，但此时请求还未发起
  const [replyList, setReplyList] = useState<CommentType>({} as CommentType)

  useEffect(() => {
    // 获取评论的回复列表
    const fetchData = async () => {
      const res = await http.get<CommentRes>('/comments', {
        params: {
          // c：表示评论的回复，a：表示评论
          type: 'c',
          source: comment.com_id,
        },
      })
      setReplyList(res.data.data)
    }
    fetchData()
  }, [comment])

  const hasMore = replyList.end_id !== replyList.last_id
  const loadMore = async () => {
    const res = await http.get<CommentRes>('/comments', {
      params: {
        // c：表示评论的回复，a：表示评论
        type: 'c',
        source: comment.com_id,
        offset: replyList.last_id,
      },
    })
    setReplyList({
      ...res.data.data,
      results: [...res.data.data.results, ...replyList.results],
    })
  }

  return (
    <div className={styles.root}>
      <div className="reply-wrapper">
        {/* 顶部导航栏 */}
        <NavBar className="transparent-navbar" onLeftClick={onClose}>
          {comment.reply_count}条回复
        </NavBar>

        {/* 原评论信息 */}
        <div className="origin-comment">
          {/* type用于控制是否显示回复按钮 */}
          <CommentItem comment={comment} type="reply" />
        </div>

        <div className="reply-list">
          <div className="reply-header">全部回复</div>
          {/* 错误写法，组件首次渲染时，请求还未发起，此时replyList.total_count为undefined */}
          {/* {replyList.total_count === 0 ? ( */}
          {comment.reply_count === 0 ? (
            <NoComment />
          ) : (
            // 发起请求获取数据的操作在页面首次加载完成后才会发生，此时replyList.results为undefined
            replyList.results &&
            replyList.results.map((item) => (
              <CommentItem key={item.com_id} comment={item} type="reply" />
            ))
          )}
          <InfiniteScroll hasMore={hasMore} loadMore={loadMore} />
        </div>

        {/* type用于控制是否显示评论和点赞按钮 */}
        <CommentFooter type="reply" />
      </div>
    </div>
  )
}

export default CommentReply
