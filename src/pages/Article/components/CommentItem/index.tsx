import Icon from '@/components/Icon'
import { CommentDetail } from '@/store/types'
import dayjs from 'dayjs'
import styles from './index.module.scss'

type Props = {
  comment: CommentDetail
}

const CommentItem = ({ comment }: Props) => {
  return (
    <div className={styles.root}>
      {/* 评论者头像 */}
      <div className="avatar">
        <img src={comment.aut_photo} alt="" />
      </div>

      <div className="comment-info">
        {/* 评论者名字 */}
        <div className="comment-info-header">
          <span className="name">{comment.aut_name}</span>

          {/* 关注或点赞按钮 */}
          <span className="thumbs-up">
            {comment.like_count}
            <Icon
              type={comment.is_liking ? 'iconbtn_like_sel' : 'iconbtn_like2'}
            ></Icon>
          </span>
        </div>
        {/* 评论内容 */}
        <div className="comment-content">{comment.content}</div>
        <div className="comment-footer">
          {/* 回复按钮 */}
          <span className="replay">
            {comment.reply_count}回复 <Icon type="iconbtn_right" />
          </span>
          {/* 评论日期 */}
          <span className="comment-time">
            {dayjs(comment.pubdate).fromNow()}
          </span>
          {/* 未提供举报评论接口 */}
          {/* <Icon className="close" type="iconbtn_essay_close" /> */}
        </div>
      </div>
    </div>
  )
}

export default CommentItem
