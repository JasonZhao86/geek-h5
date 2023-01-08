import NavBar from '@/components/NavBar'
import React, { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { addComment } from '@/store/actions'
import styles from './index.module.scss'

type Props = {
  onClose: () => void
  articleId: string
}

/**
 * @param {String} props.com_id 评论ID
 * @param {String} props.name 评论人姓名
 * @param {Function} props.onClose 关闭评论表单时的回调函数
 * @param {Function} props.onComment 发表评论成功时的回调函数
 * @param {String} props.articleId 文章ID
 */
const CommentInput = ({ onClose, articleId }: Props) => {
  const [value, setValue] = useState('')
  const txtRef = useRef<HTMLTextAreaElement>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    // 解决页面抖动的问题
    setTimeout(() => {
      txtRef.current!.focus()
    }, 600)
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)
  }

  const onSendComment = async () => {
    if (value.trim() === '') return

    await dispatch(addComment(articleId, value))
    // await等待添加成功后，关闭评论抽屉
    onClose()
  }

  return (
    <div className={styles.root}>
      <NavBar
        onLeftClick={onClose}
        rightContent={
          <span className="publish" onClick={onSendComment}>
            发表
          </span>
        }
      >
        评论文章
      </NavBar>

      <div className="input-area">
        {/* {name && <div className="at">@{name}:</div>} */}
        <textarea
          ref={txtRef}
          placeholder="说点什么~"
          rows={10}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default CommentInput
