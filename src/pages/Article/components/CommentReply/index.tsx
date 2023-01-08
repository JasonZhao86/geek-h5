import NavBar from '@/components/NavBar'
import NoComment from '@/components/NoComment'
import CommentInput from '../CommentInput'
import { CommentDetail } from '@/store/types'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import http from '@/utils/http'
import CommentFooter from '../CommentFooter'
import CommentItem from '../CommentItem'
import { CommentRes } from '@/store/actions/article'
import { updateComment } from '@/store/actions'
import { CommentType } from '@/store/types'
import { Drawer } from 'antd-mobile'
import { InfiniteScroll } from 'antd-mobile-v5'
import styles from './index.module.scss'

type Props = {
  articleId: string
  onClose: () => void
  comment: CommentDetail
}

// 添加回复成功后的响应类型
type AddReplyRes = {
  data: {
    art_id: string
    com_id: string
    new_obj: CommentDetail
    target: string
  }
  message: string
}

const CommentReply = ({ articleId, onClose, comment }: Props) => {
  // 演示直接在组件中发请求获取并渲染数据要注意的问题：首次渲染组件并渲染获取到的数据，但此时请求还未发起
  const [replyList, setReplyList] = useState<CommentType>({} as CommentType)
  const dispatch = useDispatch()

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

  // 对评论回复抽屉的状态
  const [drawerStatus, setDrawerStatus] = useState({
    visible: false,
  })

  const onOpenDrawer = () => {
    setDrawerStatus({
      visible: true,
    })
  }

  const onCloseDrawer = () => {
    setDrawerStatus({
      visible: false,
    })
  }

  // 发送请求，添加回复
  const onAddReply = async (content: string) => {
    const res = await http.post<AddReplyRes>('/comments', {
      target: comment.com_id,
      content,
      // 添加回复时，必传文章的articleId
      art_id: articleId,
    })

    // 添加评论的一条回复数据
    setReplyList({
      ...replyList,
      total_count: replyList.total_count + 1,
      results: [res.data.data.new_obj, ...replyList.results],
    })

    // 将新增的回复添加redux中
    dispatch(
      updateComment({
        ...comment,
        reply_count: comment.reply_count + 1,
      })
    )
  }

  return (
    <div className={styles.root}>
      <div className="reply-wrapper">
        {/* 顶部导航栏 */}
        <NavBar className="transparent-navbar" onLeftClick={onClose}>
          {/* 改为本地组件的state中获取总的回复条数，不再从父组件中获取，否则需要更新父组件中的数据 */}
          {replyList.total_count}条回复
        </NavBar>

        {/* 原评论信息 */}
        <div className="origin-comment">
          {/* type用于控制是否显示回复按钮 */}
          <CommentItem comment={comment} type="reply" />
        </div>

        <div className="reply-list">
          <div className="reply-header">全部回复</div>
          {/* 注意，组件首次渲染时，请求还未发起，此时replyList.total_count为undefined */}
          {replyList.total_count === 0 ? (
            // 改为本地组件的state中获取总的回复条数，不再从父组件中获取，否则需要更新父组件中的数据
            // {comment.reply_count === 0 ? (
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
        <CommentFooter onOpenComment={onOpenDrawer} type="reply" />
      </div>

      {/* 对评论回复的抽屉 */}
      <Drawer
        className="drawer"
        position="bottom"
        children={''}
        sidebar={
          <div className="drawer-sidebar-wrapper">
            {drawerStatus.visible && (
              <CommentInput
                articleId={articleId}
                onClose={onCloseDrawer}
                name={comment.aut_name}
                onAddReply={onAddReply}
              />
            )}
          </div>
        }
        open={drawerStatus.visible}
        onOpenChange={onCloseDrawer}
      ></Drawer>
    </div>
  )
}

export default CommentReply
