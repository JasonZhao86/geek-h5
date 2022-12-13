import Icon from '@/components/Icon'
import styles from './index.module.scss'
import { Modal } from 'antd-mobile'
import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setFeedbackAction } from '@/store/actions'

/**
 * 举报反馈菜单
 */
const MoreAction = () => {
  const { visible } = useSelector((state) => state.home.feedbackAction)
  // 举报类型：normal 不感兴趣或拉黑作者 | junk 垃圾内容
  const [feedbackType, setFeedbackType] = useState('normal')

  const dispatch = useDispatch()

  // 关闭弹框时的事件监听函数
  const onClose = () => {
    // 更新弹出菜单的状态
    dispatch(
      setFeedbackAction({
        visible: false,
        articleId: 0,
      })
    )
  }

  return (
    <div className={styles.root}>
      <Modal
        className="more-action-modal"
        title=""
        transparent
        maskClosable
        // 控制Modal窗口是否显示
        visible={visible}
        footer={[]}
        onClose={onClose}
      >
        <div className="more-action">
          {/* normal 类型时的菜单内容 */}
          {feedbackType === 'normal' && (
            <>
              <div className="action-item">
                <Icon type="iconicon_unenjoy1" /> 不感兴趣
              </div>
              <div
                className="action-item"
                onClick={() => setFeedbackType('junk')}
              >
                <Icon type="iconicon_feedback1" />
                <span className="text">反馈垃圾内容</span>
                <Icon type="iconbtn_right" />
              </div>
              <div className="action-item">
                <Icon type="iconicon_blacklist" /> 拉黑作者
              </div>
            </>
          )}

          {/* junk 类型时的菜单内容 */}
          {feedbackType === 'junk' && (
            <>
              <div
                className="action-item"
                onClick={() => setFeedbackType('normal')}
              >
                <Icon type="iconfanhui" />
                <span className="back-text">反馈垃圾内容</span>
              </div>
              <div className="action-item">旧闻重复</div>
              <div className="action-item">广告软文</div>
              <div className="action-item">内容不实</div>
              <div className="action-item">涉嫌违法</div>
              <div className="action-item">
                <span className="text">其他问题</span>
                <Icon type="iconbtn_right" />
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default MoreAction
