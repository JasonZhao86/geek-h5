import Icon from '@/components/Icon'
import { RootState } from '@/store'
import { useSelector, useDispatch } from 'react-redux'
import { setArticleLiking, setAritcleCollection } from '@/store/actions'
import styles from './index.module.scss'

type Props = {
  goComment: () => void
  onOpenShare: () => void
  onOpenComment: () => void
}

const CommentFooter = ({ goComment, onOpenShare, onOpenComment }: Props) => {
  const articleDetail = useSelector(
    (item: RootState) => item.article.articleDetail
  )
  const dispatch = useDispatch()

  const onLike = () => {
    dispatch(setArticleLiking(articleDetail.art_id, articleDetail.attitude))
  }

  const onCollected = () => {
    dispatch(
      setAritcleCollection(articleDetail.art_id, articleDetail.is_collected)
    )
  }

  return (
    <div className={styles.root}>
      <div className="input-btn" onClick={onOpenComment}>
        <Icon type="iconbianji" />
        <span>去评论</span>
      </div>
      <>
        <div className="action-item" onClick={goComment}>
          <Icon type="iconbtn_comment" />
          <p>评论</p>
          <span className="bage">{articleDetail.comm_count}</span>
        </div>
        <div className="action-item" onClick={onLike}>
          {/* attitude: 1表示点赞，0表示不喜欢，-1表示无态度 */}
          <Icon
            type={
              articleDetail.attitude === 1
                ? 'iconbtn_like_sel'
                : 'iconbtn_like2'
            }
          />
          <p>点赞</p>
        </div>
      </>

      <div className="action-item" onClick={onCollected}>
        <Icon
          type={
            articleDetail.is_collected
              ? 'iconbtn_collect_sel'
              : 'iconbtn_collect'
          }
        />
        <p>收藏</p>
      </div>
      <div className="action-item" onClick={onOpenShare}>
        <Icon type="iconbtn_share" />
        <p>分享</p>
      </div>
    </div>
  )
}

export default CommentFooter
