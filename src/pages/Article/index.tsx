import Icon from '@/components/Icon'
import Sticky from '@/components/Sticky'
import NavBar from '@/components/NavBar'
import NoComment from '@/components/NoComment'
import CommentItem from './components/CommentItem'
import CommentFooter from './components/CommentFooter'
import CommentInput from './components/CommentInput'
import CommentReply from './components/CommentReply'
import Share from './components/Share'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router'
import {
  getArticleInfo,
  getArticleComments,
  getMoreArticleComments,
  setCommentLiking,
} from '@/store/actions'
import classNames from 'classnames'
import { RootState } from '@/store'
import dayjs from 'dayjs'
import DOMPurify from 'dompurify'
import hljs from 'highlight.js'
import throttle from 'lodash/throttle'
import { InfiniteScroll } from 'antd-mobile-v5'
import { Drawer } from 'antd-mobile'
import 'highlight.js/styles/vs2015.css'
import styles from './index.module.scss'
import { CommentDetail } from '@/store/types'

const Article = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { id: articleId } = useParams<{ id: string }>()
  const info = useSelector((state: RootState) => state.article.articleDetail)
  const [showNavAuthor, setShowNavAuthor] = useState(false)
  const authorRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const { results, end_id, last_id } = useSelector(
    (state: RootState) => state.article.comments
  )

  // 进入页面时，请求文章详情数据
  useEffect(() => {
    // 请求文章详情数据
    dispatch(getArticleInfo(articleId))
    // 请求评论列表数据
    dispatch(
      getArticleComments({
        // a-对文章(article)的评论，c-对评论(comment)的回复
        type: 'a',
        source: articleId,
      })
    )
  }, [dispatch, articleId])

  // 在文章加载后，对文章内容中的代码进行语法高亮
  useEffect(() => {
    // 配置 highlight.js
    hljs.configure({
      // 忽略未经转义的HTML字符
      ignoreUnescapedHTML: true,
    })

    // 获取到渲染正文的容器元素
    const dgHtml = document.querySelector('.dg-html')

    // 查找容器元素下符合 pre code 选择器规则的子元素，进行高亮
    const codes = dgHtml?.querySelectorAll('pre code')
    if (codes?.length! > 0) {
      return codes?.forEach((el) => hljs.highlightElement(el as HTMLElement))
    }

    // 查找容器元素下的 pre 元素，进行高亮
    const pre = document.querySelectorAll('pre')
    if (pre.length > 0) {
      return pre.forEach((el) => hljs.highlightElement(el))
    }
  }, [])

  // 监听滚动，控制 NavBar 中作者信息的显示或隐藏
  useEffect(() => {
    const authorEl = authorRef.current!
    const wrapperEl = wrapperRef.current!

    // 滚动监听函数，使用lodash的节流函数，控制执行频度
    const onScroll = throttle(() => {
      // 获取 .author 元素的位置信息
      const rect = authorEl.getBoundingClientRect()
      /**
       * 如果 .author 元素的顶部移出屏幕外，则显示顶部导航栏上的作者信息，
       * rect有可能为undefined，当滚动过程当中突然点返回，导致组件Article
       * 组件被销毁，此时获取到的rect就是undefined
       */
      if (rect && rect.top <= 0) {
        setShowNavAuthor(true)
      } else {
        // 否则隐藏导航栏上的作者信息，ShowNavAuthor为false不执行
        showNavAuthor && setShowNavAuthor(false)
      }
    }, 300)
    // 滚动的是.wrapper内容部分，因此只能在.wrapper内容部分监听滚动事件，不能在整个document上监听
    wrapperEl.addEventListener('scroll', onScroll)

    return () => {
      // 注销 .wrapper 元素的 scroll 事件
      wrapperEl.removeEventListener('scroll', onScroll)
    }
  }, [showNavAuthor])

  // 组件每次上拉刷新渲染last_id会变，因此不需要useState提供状态
  const hasMore = last_id !== end_id
  const loadMore = async () => {
    await dispatch(
      // 'a'表示品论，'c'表示评论回复
      getMoreArticleComments({ type: 'a', source: articleId, offset: last_id })
    )
  }

  const commentRef = useRef<HTMLDivElement>(null)
  /**
   * 文章详情页首次渲染时，评论列表在最下面，不在可视区，组件每次渲染时，必须保证
   * isShowComment不被重新定义初始化，所以需要使用useRef记录
   *  */
  const isShowComment = useRef(false)
  const goComment = () => {
    const wrapperEl = wrapperRef.current!
    // 已经显示，需要滚动回文章头部
    if (isShowComment.current) {
      wrapperEl.scrollTo(0, 0)
    } else {
      // 处理js中像素和视宽的适配问题
      const top = (46 / 375) * document.documentElement.clientWidth
      // 不在显示区，需要滚动到评论列表位置
      wrapperEl.scrollTo(0, commentRef.current!.offsetTop - top)
    }
    isShowComment.current = !isShowComment.current
  }

  // 分享抽屉状态
  const [shareDrawerStatus, setShareDrawerStatus] = useState(false)
  const onOpenShare = () => {
    setShareDrawerStatus(true)
  }

  const onCloseShare = () => {
    setShareDrawerStatus(false)
  }

  // 评论抽屉状态
  const [commentDrawerStatus, setCommentDrawerStatus] = useState({
    visible: false,
  })

  const onOpenComment = () => {
    setCommentDrawerStatus({ visible: true })
  }

  const onCloseComment = () => {
    setCommentDrawerStatus({ visible: false })
  }

  // 回复评论抽屉状态
  const [showReply, setShowReply] = useState({
    visible: false,
    // 回复评论中需要显示原始评论，从这里传入
    originComment: {} as CommentDetail,
  })

  const onOpenReply = (comment: CommentDetail) => {
    setShowReply({
      visible: true,
      originComment: comment,
    })
  }

  const onCloseReply = () => {
    setShowReply({
      visible: false,
      originComment: {} as CommentDetail,
    })
  }

  // 更新回复的点赞状态
  const setReplyLiking = (comment: CommentDetail) => {
    if (comment.is_liking) {
      // 取消点赞
      setShowReply({
        visible: true,
        originComment: {
          ...comment,
          is_liking: false,
          like_count: comment.like_count <= 0 ? 0 : comment.like_count - 1,
        },
      })
    } else {
      // 点赞
      setShowReply({
        visible: true,
        originComment: {
          ...comment,
          is_liking: true,
          like_count: comment.like_count + 1,
        },
      })
    }
    dispatch(setCommentLiking(comment))
  }

  return (
    <div className={styles.root}>
      <div className="root-wrapper">
        {/* 顶部导航栏 */}
        <NavBar
          onLeftClick={() => history.go(-1)}
          rightContent={
            <span onClick={onOpenShare}>
              <Icon type="icongengduo" />
            </span>
          }
        >
          {showNavAuthor ? (
            <div className="nav-author">
              <img src={info.aut_photo} alt="" />
              <span className="name">{info.aut_name}</span>
              <span
                className={classNames(
                  'follow',
                  info.is_followed ? 'followed' : ''
                )}
              >
                {info.is_followed ? '已关注' : '关注'}
              </span>
            </div>
          ) : (
            ''
          )}
        </NavBar>

        {/* 数据加载完成后显示的实际界面 */}
        <>
          <div className="wrapper" ref={wrapperRef}>
            <div className="article-wrapper">
              {/* 文章描述信息栏 */}
              <div className="header">
                <h1 className="title">{info.title}</h1>

                <div className="info">
                  <span>{dayjs(info.pubdate).format('YYYY-MM-DD')}</span>
                  <span>{info.read_count} 阅读</span>
                  <span>{info.comm_count} 评论</span>
                </div>

                <div className="author" ref={authorRef}>
                  <img src={info.aut_photo} alt="" />
                  <span className="name">{info.aut_name}</span>
                  <span
                    className={classNames(
                      'follow',
                      info.is_followed ? 'followed' : ''
                    )}
                  >
                    {info.is_followed ? '已关注' : '关注'}
                  </span>
                </div>
              </div>

              {/* 文章正文内容区域 */}
              <div className="content">
                <div
                  className="content-html dg-html"
                  // info.content有可能为undefined
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(info.content || ''),
                  }}
                ></div>
                <div className="date">
                  发布文章时间：{dayjs(info.pubdate).fromNow()}
                </div>
              </div>
            </div>

            {/* 文章评论区 */}
            <div className="comment" ref={commentRef}>
              {/* navbar组件的高度是46px，吸顶距离顶部的高度是46，否则会被navbar组件盖住 */}
              <Sticky offset={46}>
                {/* 评论总览信息 */}
                <div className="comment-header">
                  <span>全部评论（{info.comm_count}）</span>
                  <span>{info.like_count} 点赞</span>
                </div>
              </Sticky>

              {/* 评论列表 */}
              {info.comm_count === 0 ? (
                // 没有评论时显示的界面
                <NoComment />
              ) : (
                // 有评论时显示的评论列表
                <div className="comment-list">
                  {/* 首次渲染是results还未获取到数据，为undefined */}
                  {results?.map((item) => (
                    <CommentItem
                      key={item.com_id}
                      comment={item}
                      onOpenReply={onOpenReply}
                      updateCommentLiking={() =>
                        dispatch(setCommentLiking(item))
                      }
                    />
                  ))}
                </div>
              )}
              <InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMore}
              ></InfiniteScroll>
            </div>
          </div>
        </>
        {/* 评论工具栏 */}
        <CommentFooter
          goComment={goComment}
          onOpenShare={onOpenShare}
          onOpenComment={onOpenComment}
        />
      </div>
      {/* 分享抽屉 */}
      <Drawer
        className="drawer-share"
        position="bottom"
        children={''}
        sidebar={shareDrawerStatus && <Share onClose={onCloseShare}></Share>}
        open={shareDrawerStatus}
        onOpenChange={onCloseShare}
      ></Drawer>

      {/* 评论表单抽屉 */}
      <Drawer
        className="drawer"
        position="bottom"
        children={''}
        sidebar={
          <div className="drawer-sidebar-wrapper">
            {commentDrawerStatus.visible && (
              <CommentInput onClose={onCloseComment} articleId={info.art_id} />
            )}
          </div>
        }
        open={commentDrawerStatus.visible}
        onOpenChange={onCloseComment}
      ></Drawer>

      {/* 评论回复列表抽屉 */}
      <Drawer
        className="drawer-right"
        position="right"
        children={''}
        sidebar={
          <div className="drawer-sidebar-wrapper">
            {showReply.visible && (
              <CommentReply
                articleId={info.art_id}
                onClose={onCloseReply}
                comment={showReply.originComment}
                setReplyLiking={() => setReplyLiking(showReply.originComment)}
              />
            )}
          </div>
        }
        open={showReply.visible}
        onOpenChange={onCloseReply}
      ></Drawer>
    </div>
  )
}

export default Article
